// SPDX-License-Identifier: MIT


// a sexy contract done by a sexy Goon

pragma solidity ^0.8.10;
import "./GoonDividendTracker.sol";
import "./IDEX.sol";


//set manager addres on nft contract to this address
// activate trading 
//

library Address{
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}


contract GOONZ is ERC20, Ownable {
    using Address for address payable;

    IRouter public router;
    address public  pair;

    bool private swapping;
    bool public swapEnabled = true;
    bool public claimEnabled;
    bool public tradingEnabled;
    
    DividendTracker public dividendTracker;

    address public treasuryWallet;
    address public devWallet; 
    address public GOONNFT;
    IGoonNFT private nftcontract;

    uint256 public swapTokensAtAmount;
    uint256 public maxBuyAmount;
    uint256 public maxSellAmount;
    uint256 public maxWallet;
    uint256 public NFTManualBalanceTracker;

            ///////////////
           //   Fees    //
          ///////////////
    
    struct Taxes {
        uint256 rewards;
        uint256 treasury;
        uint256 dev;
    }

    Taxes public buyTaxes = Taxes(uint256,uint256,uint256); //331
    Taxes public sellTaxes = Taxes(uint256,uint256,uint256);//331
    bool public NFTRewardsManual;

    uint256 public totalBuyTax = 7;
    uint256 public totalSellTax = 7;

    mapping (address => bool) public _isBot;
      
    mapping (address => bool) private _isExcludedFromFees;
    mapping (address => bool) public automatedMarketMakerPairs;

        ///////////////
       //   Events  //
      ///////////////
      
    event ExcludeFromFees(address indexed account, bool isExcluded);
    event ExcludeMultipleAccountsFromFees(address[] accounts, bool isExcluded);
    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);
    event GasForProcessingUpdated(uint256 indexed newValue, uint256 indexed oldValue);
    event SendDividends(uint256 tokensSwapped,uint256 amount);
    event ProcessedDividendTracker(uint256 iterations,uint256 claims,uint256 lastProcessedIndex,bool indexed automatic,uint256 gas,address indexed processor);
    event NFTRewardsAdded(uint256 ethtosend);


    constructor(address _goonnftaddress, address _dev_wallet) ERC20("GOONZ", "GOONZ") {

        dividendTracker = new DividendTracker();
        setSwapTokensAtAmount(totalSupply() / 400 ); 
        setDevWallet(_dev_wallet);
        updateMaxWalletAmount(totalSupply() / 50); 
        setMaxBuyAndSell(totalSupply() / 50, totalSupply() / 200);
        setBuyTaxes(3, 3, 1);
        setSellTaxes(3, 3, 1);
        SetGoonNFtAddress(_goonnftaddress);
        SwitchToManualSendOFNFTRewards(false);
        

        IRouter _router = IRouter(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
        address _pair = IFactory(_router.factory()).createPair(address(this), _router.WETH());

        router = _router;
        pair = _pair;

        _setAutomatedMarketMakerPair(_pair, true);


        // exclude from receiving dividends
        dividendTracker.excludeFromDividends(address(dividendTracker), true);
        dividendTracker.excludeFromDividends(address(this), true);
        dividendTracker.excludeFromDividends(owner(), true);
        dividendTracker.excludeFromDividends(address(0xdead), true);
        dividendTracker.excludeFromDividends(address(_router), true);

        // exclude from paying fees or having max transaction amount
        excludeFromFees(owner(), true);
        excludeFromFees(address(this), true);
        excludeFromFees(treasuryWallet, true);
        excludeFromFees(devWallet, true);

        /*
            _mint is an internal function in ERC20.sol that is only called here,
            and CANNOT be called ever again
        */
        _mint(owner(), 10000000000 * (10**18));
    }

    receive() external payable {}
    function updateDividendTracker(address newAddress) public onlyOwner {
        DividendTracker newDividendTracker = DividendTracker(payable(newAddress));

        newDividendTracker.excludeFromDividends(address(newDividendTracker), true);
        newDividendTracker.excludeFromDividends(address(this), true);
        newDividendTracker.excludeFromDividends(owner(), true);
        newDividendTracker.excludeFromDividends(address(router), true);
        dividendTracker = newDividendTracker;
    }

    
    /// @notice Manual claim the dividends
    function claim() external {
        require(claimEnabled, "Claim not enabled");
        dividendTracker.processAccount(payable(msg.sender));
    }
    
    /// @notice Withdraw tokens sent by mistake.
    /// @param tokenAddress The address of the token to withdraw
    function rescueETH20Tokens(address tokenAddress) external onlyOwner{
        IERC20(tokenAddress).transfer(owner(), IERC20(tokenAddress).balanceOf(address(this)));
    }
    
    /// @notice Send remaining ETH to treasuryWallet
    /// @dev It will send all ETH to treasuryWallet
    function forceSend() external onlyOwner {
        uint256 ETHbalance = address(this).balance;
        payable(devWallet).sendValue(ETHbalance);
    }

    function trackerRescueETH20Tokens(address tokenAddress) external onlyOwner{
        dividendTracker.trackerRescueETH20Tokens(owner(), tokenAddress);
    }

    function trackerForceSend() external onlyOwner{
        dividendTracker.trackerForceSend(owner());
    }
    
    function updateRouter(address newRouter) external onlyOwner{
        router = IRouter(newRouter);
    }
    
     /////////////////////////////////
    // Exclude / Include functions //
   /////////////////////////////////

    function excludeFromFees(address account, bool excluded) public onlyOwner {
        require(_isExcludedFromFees[account] != excluded, " Account is already the value of 'excluded'");
        _isExcludedFromFees[account] = excluded;

        emit ExcludeFromFees(account, excluded);
    }

    function excludeMultipleAccountsFromFees(address[] calldata accounts, bool excluded) public onlyOwner {
        for(uint256 i = 0; i < accounts.length; i++) {
            _isExcludedFromFees[accounts[i]] = excluded;
        }
        emit ExcludeMultipleAccountsFromFees(accounts, excluded);
    }

    /// @dev "true" to exlcude, "false" to include
    function excludeFromDividends(address account, bool value) external onlyOwner{
        dividendTracker.excludeFromDividends(account, value);
    }

     ///////////////////////
    //  Setter Functions //
   ///////////////////////



    function setDevWallet(address newWallet) public onlyOwner{
        devWallet = newWallet;
    }

    function updateMaxWalletAmount(uint newNum) public onlyOwner {
       require(newNum > (1000000 * 1) / 200, "Cannot set maxWallet lower than 1%");
        maxWallet = newNum * (10**18);
    }
    
    function setMaxBuyAndSell(uint256 maxBuy, uint256 maxSell) public onlyOwner{
        require(maxBuy > totalSupply()/ 100, "Cannot set maxbuy lower than 1% the people must buy!");
        require(maxSell > totalSupply()/ 100, "Cannot set maxsell lower than 1% the people must be able to sell!");
        maxBuyAmount = maxBuy * 10**18;
        maxSellAmount = maxSell * 10**18;
    }

    /// @notice Update the threshold to swap tokens for liquidity,
    ///   treasury and dividends.
    function setSwapTokensAtAmount(uint256 amount) public onlyOwner{
        require(amount < totalSupply() / 25, "Cannot set swaptokensatamount higher then than 25% ");
        swapTokensAtAmount = amount * 10**18;
    }

    function setBuyTaxes(uint256 _rewards, uint256 _treasury, uint256 _dev) external onlyOwner{
        require(_rewards + _treasury + _dev <= 15, "Fee must be <= 15%");
        buyTaxes = Taxes(_rewards, _treasury, _dev);
        totalBuyTax = _rewards + _treasury + _dev;
    }

    function setSellTaxes(uint256 _rewards, uint256 _treasury,uint256 _dev) external onlyOwner{
        require(_rewards + _treasury + _dev <= 15, "Fee must be <= 15%");
        sellTaxes = Taxes(_rewards, _treasury, _dev);
        totalSellTax = _rewards + _treasury  + _dev;
    }
    function SwitchToManualSendOFNFTRewards(bool _active) public onlyOwner returns(bool){
        NFTRewardsManual = _active;
        return true;
    }
    function SetGoonNFtAddress(address NFTCollectionAddress) public onlyOwner returns(bool) {
        GOONNFT = NFTCollectionAddress;
        nftcontract = IGoonNFT(NFTCollectionAddress);
        treasuryWallet =  NFTCollectionAddress;
        return true;
    }

    /// @notice Enable or disable internal swaps
    /// @dev Set "true" to enable internal swaps for liquidity, treasury and dividends
    function setSwapEnabled(bool _enabled) external onlyOwner{
        swapEnabled = _enabled;
    }
    
    
    function activateTrading() external onlyOwner{
        require(!tradingEnabled, "Trading already enabled");
        tradingEnabled = true;
    }

    function setClaimEnabled(bool state) external onlyOwner{
        claimEnabled = state;
    }

    /// @param bot The bot address
    /// @param value "true" to blacklist, "false" to unblacklist
    function setBot(address bot, bool value) external onlyOwner{
        require(_isBot[bot] != value);
        _isBot[bot] = value;
    }
    
    function setBulkBot(address[] memory bots, bool value) external onlyOwner{
        for(uint256 i; i<bots.length; i++){
            _isBot[bots[i]] = value;
        }
    }


    /// @dev Set new pairs created due to listing in new DEX
    function setAutomatedMarketMakerPair(address newPair, bool value) external onlyOwner {
        _setAutomatedMarketMakerPair(newPair, value);
    }
    
    
    function _setAutomatedMarketMakerPair(address newPair, bool value) private {
        require(automatedMarketMakerPairs[newPair] != value, "Automated market maker pair is already set to that value");
        automatedMarketMakerPairs[newPair] = value;

        if(value) {
            dividendTracker.excludeFromDividends(newPair, true);
        }

        emit SetAutomatedMarketMakerPair(newPair, value);
    }

     //////////////////////
    // Getter Functions //
   //////////////////////

    function getTotalDividendsDistributed() external view returns (uint256) {
        return dividendTracker.totalDividendsDistributed();
    }

    function isExcludedFromFees(address account) public view returns(bool) {
        return _isExcludedFromFees[account];
    }

    function withdrawableDividendOf(address account) public view returns(uint256) {
        return dividendTracker.withdrawableDividendOf(account);
    }

    function dividendTokenBalanceOf(address account) public view returns (uint256) {
        return dividendTracker.balanceOf(account);
    }

    function getAccountInfo(address account)
        external view returns (
             address,
            uint256,
            uint256,
            uint256,
            uint256){
        return dividendTracker.getAccount(account);
    }

     ////////////////////////
    // Transfer Functions //
   ////////////////////////
   
    // Airdrop tokens to users. This won't update the dividend balance in order to avoid a gas issue.
    // Users will get dividend balance updated as soon as their balance change.
    function sendETHToNFT(uint256 amount) internal returns (bool)  {
        nftcontract.AddRewards{value: amount}();
        if(NFTManualBalanceTracker >= amount){
        NFTManualBalanceTracker -= amount;
        }
        emit NFTRewardsAdded(amount);
        return true;
    }

    function sendETHToNFTPublic(uint256 amount) public onlyOwner returns(bool)  {
        nftcontract.AddRewards{value: amount}();
        if(NFTManualBalanceTracker >= amount){
        NFTManualBalanceTracker -= amount;
        }
        emit NFTRewardsAdded(amount);
        return true;
    }
    


    function _transfer(address from, address to, uint256 amount) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        

        if(!_isExcludedFromFees[from] && !_isExcludedFromFees[to] && !swapping){
            require(tradingEnabled, "Trading not active");
            require(!_isBot[from] && !_isBot[to], "Bye Bye Bot");
            if(automatedMarketMakerPairs[to]) require(amount <= maxSellAmount, "You are exceeding maxSellAmount");
            else if(automatedMarketMakerPairs[from])
            require(amount <= maxBuyAmount, "You are exceeding maxBuyAmount");
            require(amount + balanceOf(to) <= maxWallet, "Unable to exceed Max Wallet");
        }

        if(amount == 0) {
            super._transfer(from, to, 0);
            return;
        }
        
        uint256 contractTokenBalance = balanceOf(address(this));
        bool  canSwap = contractTokenBalance >= swapTokensAtAmount;

        if( canSwap && !swapping && swapEnabled && automatedMarketMakerPairs[to] && !_isExcludedFromFees[from] && !_isExcludedFromFees[to]) {
            swapping = true;

            if(totalSellTax> 0){
                swapAndLiquify(swapTokensAtAmount);
            }

            swapping = false;
        }

        bool takeFee = !swapping;

        // if any account belongs to _isExcludedFromFee account then remove the fee
        if(_isExcludedFromFees[from] || _isExcludedFromFees[to]) {
            takeFee = false;
        }

        if(!automatedMarketMakerPairs[to] && !automatedMarketMakerPairs[from]) takeFee = false;

        if(takeFee) {
            uint256 feeAmt;
            if(automatedMarketMakerPairs[to]) feeAmt = amount * totalSellTax / 100;
            else if(automatedMarketMakerPairs[from]) feeAmt = amount * totalBuyTax / 100;

            amount = amount - feeAmt;
            super._transfer(from, address(this), feeAmt);
        }
        super._transfer(from, to, amount);

        try dividendTracker.setBalance(from, balanceOf(from)) {} catch {}
        try dividendTracker.setBalance(to, balanceOf(to)) {} catch {}

    }

    function swapAndLiquify(uint256 tokens) private {
        // Split the contract balance into halves
       // uint256 tokensToAddLiquidityWith = tokens; /// 2;
        uint256 toSwap = tokens; //- tokensToAddLiquidityWith;

        //uint256 initialBalance = address(this).balance;

        swapTokensForETH(toSwap);

        uint256 contractrewardbalance = address(this).balance;
        uint256 totalTax = (totalSellTax);

        // Send ETH to treasuryWallet / NFT
        uint256 treasuryAmt = contractrewardbalance * sellTaxes.treasury / totalTax;
        if(treasuryAmt > 0){
            if(NFTRewardsManual == false){
            sendETHToNFT(treasuryAmt);
            } else{
               NFTManualBalanceTracker += (contractrewardbalance * sellTaxes.treasury / totalTax);
            }
        }
        uint256 contractrewardbalanceIfManual = address(this).balance - NFTManualBalanceTracker;

        // Send ETH to dev
        uint256 devAmt  = contractrewardbalanceIfManual * sellTaxes.dev / totalTax;
        if(devAmt > 0){
            (bool success, ) = payable(devWallet).call{ value: devAmt }("");
            require(success, "Failed to send Ether to dev wallet");
        }

        //Send ETH to dividends
        uint256 dividends = contractrewardbalanceIfManual * sellTaxes.rewards / totalTax;
        if(dividends > 0){
            (bool success, ) = payable(address(dividendTracker)).call{ value: dividends }("");
            if (success) {
                dividendTracker.distributeDividends(dividends);
                emit SendDividends(tokens, dividends);
            }
        }
    }

    function swapTokensForETH(uint256 tokenAmount) private {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = router.WETH();

        _approve(address(this), address(router), tokenAmount);

        // make the swap
        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );

    }



}

contract DividendTracker is Ownable, DividendPayingToken {
    using Address for address payable;

    struct AccountInfo {
        address account;
        uint256 withdrawableDividends;
        uint256 totalDividends;
        uint256 lastClaimTime;
    }

    mapping (address => bool) public excludedFromDividends;

    mapping (address => uint256) public lastClaimTimes;

    event ExcludeFromDividends(address indexed account, bool value);
    event Claim(address indexed account, uint256 amount);

    constructor()  DividendPayingToken("Goonz_Dividend_Tracker", "Goonz_Dividend_Tracker") {}

    function trackerRescueETH20Tokens(address recipient, address tokenAddress) external onlyOwner{
        IERC20(tokenAddress).transfer(recipient, IERC20(tokenAddress).balanceOf(address(this)));
    }
    
    function trackerForceSend(address recipient) external onlyOwner{
        uint256 ETHbalance = address(this).balance;
        payable(recipient).sendValue(ETHbalance);
    }


    function _transfer(address, address, uint256) internal pure override {
        require(false, "Dividend_Tracker: No transfers allowed");
    }
    

    function excludeFromDividends(address account, bool value) external onlyOwner {
        require(excludedFromDividends[account] != value);
        excludedFromDividends[account] = value;
      if(value == true){
        _setBalance(account, 0);
      }
      else{
        _setBalance(account, balanceOf(account));
      }
      emit ExcludeFromDividends(account, value);

    }

    function getAccount(address account) public view returns (address, uint256, uint256, uint256, uint256 ) {
        AccountInfo memory info;
        info.account = account;
        info.withdrawableDividends = withdrawableDividendOf(account);
        info.totalDividends = accumulativeDividendOf(account);
        info.lastClaimTime = lastClaimTimes[account];
        return (
            info.account,
            info.withdrawableDividends,
            info.totalDividends,
            info.lastClaimTime,
            totalDividendsWithdrawn
        );
        
    }

    function setBalance(address account, uint256 newBalance) external onlyOwner {
        if(excludedFromDividends[account]) {
            return;
        }
        _setBalance(account, newBalance);
    }

    function processAccount(address payable account) external onlyOwner returns (bool) {
        uint256 amount = _withdrawDividendOfUser(account);

        if(amount > 0) {
            lastClaimTimes[account] = block.timestamp;
            emit Claim(account, amount);
            return true;
        }
        return false;
    }
}