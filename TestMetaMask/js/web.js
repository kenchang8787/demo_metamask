
// ---------- Init ---------- //
$(document).ready(function () {

    AppendLog(`初始化開始`);
    
    // 若是未安裝MetaMask Plugin, 則請用戶去下載
    if (!IsMetaMaskInstalled(true)) {
        var goDownload = confirm('當前瀏覽器未安裝MetaMask, 是否前往下載?');

        if (goDownload) {
            window.open("https://metamask.io/download/", '_blank');
        }
        else {
            alert('未下載MetaMask擴充套件時, 有些功能無法使用');
        }

        return;
    }
})


// ---------- Ether & MetaMask RPC API ---------- //
function IsMetaMaskInstalled(showlog) {

    if (showlog)
        AppendLog(`偵測用戶瀏覽器是否有支援MetaMask`);

    if (typeof (window.ethereum) == 'undefined' || !ethereum.isMetaMask) {
        $('#ethereum_installed').text('未導入');
        $('#ethereum_connected').text('false');
        $('#metamask_ismetamask').text('false');
        $('#metamask_network').text('未連接');
        return false;
    }
    
    $('#ethereum_installed').text('已導入');
    $('#ethereum_connected').text(ethereum.isConnected());
    $('#metamask_ismetamask').text(ethereum.isMetaMask);
    $('#metamask_address').text(ethereum.selectedAddress);
    $('#metamask_network').text(parseInt(ethereum.chainId, 16));
    
    return true;
}

// 連線至 MetaMask 錢包 (要求登入)
async function ConnToMetaMask() {

    if (!IsMetaMaskInstalled())
        return;

    if (ethereum.selectedAddress != null) {
        return;
    }

    AppendLog(`登入錢包...`);

    // 若未連結至MetaMask錢包, 會開啟MetaMask Plugin連結
    await ethereum.request({
        method: 'eth_requestAccounts'
    })
    .then((result) => {
        console.log(result);
        AppendLog(`登入錢包. result=${result}`);
    })
    .catch((error) => {
        console.log(error);
        AppendLog(`登入錢包. error.message=${error.message}`);
    })
}

// 取得餘額
async function GetBalance() {
    if (!IsMetaMaskInstalled())
        return;

    if (ethereum.selectedAddress == null) {
        alert('請先登入MetaMask');
        return;
    }

    AppendLog(`獲取錢包餘額...`);

    await ethereum.request({
        method: 'eth_getBalance',
        params: [ethereum.selectedAddress,'latest']
    })
    .then((result) => {
        console.log(result);
        $('#metamask_balance').text(parseInt(result, 16));
        AppendLog(`獲取錢包餘額. result=${parseInt(result, 16)}`);
    })
    .catch((error) => {
        console.log(error);
        AppendLog(`獲取錢包餘額. error.message=${error.message}`);
    })
}

// 連線網路至指定網路 (若未登入會要求登入)
async function ConnCustomNetwork() {

    if (!IsMetaMaskInstalled())
        return;

    AppendLog(`連線至指定網路...`);

    await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{
                chainId: '0x2a',
            }],
    })
    .then((result) => {
        console.log(result);
        AppendLog(`連線至指定網路. result=${result}`);
    })
    .catch((error) => {
        console.log(error);
        AppendLog(`連線至指定網路. error.message=${error.message}`);
    })
}

// 新增並連線至指定網路 (若未登入會要求登入)
async function AddCustomNetwork() {

    if (!IsMetaMaskInstalled())
        return;

    AppendLog(`新增並連線至指定網路...`);

    await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {name: 'Ether', symbol: 'MATIC', decimals: 18},
            rpcUrls: ['https://polygon-rpc.com'],
            blockExplorerUrls: ['https://polygonscan.com'],
            }],
    })
    .then((result) => {
        console.log(result);
        AppendLog(`新增並連線至指定網路. result=${result}`);
    })
    .catch((error) => {
        console.log(error);
        AppendLog(`新增並連線至指定網路. error.message=${error.message}`);
    })
}

// 新增檢視的資產 (若未登入會要求登入)
async function AddAsset() {

    if (!IsMetaMaskInstalled())
        return;

    AppendLog(`新增檢視的資產...`);

    await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20',
            options: {
                address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                symbol: "PoS",
                decimals: 6,
                image: "https://polygonscan.com/token/images/tether_32.png"
            }
        }
    })
    .then((result) => {
        // console.log(result);
        // AppendLog(`新增檢視的資產. result=${result}`);
    })
    .catch((error) => {
        console.log(error);
        AppendLog(`新增檢視的資產. error.message=${error.message}`);
    })
}

// 簽名
async function Sign() {

    if (!IsMetaMaskInstalled())
    return;

    if (ethereum.selectedAddress == null) {
        alert('請先登入錢包');
        return;
    }

    var message = $('#sign_message').val();

    if (message == '') {
        alert('請輸入欲簽名的字串');
        return;
    }

    $('#verify_sign_message').val(message);

    AppendLog(`正在簽名...`);

    await ethereum.request({
        method: 'personal_sign',
        params: [ethereum.selectedAddress, message]
    })
    .then((result) => {
        console.log(result);
        AppendLog(`簽名. result=${result}`);
        $('#sign_result').text(result);
    })
    .catch((error) => {
        console.log(error);
        AppendLog(`簽名. error.message=${error.message}`);
    })
}

// 驗證簽名
async function VerifySign() {

    if (!IsMetaMaskInstalled())
    return;

    if (ethereum.selectedAddress == null) {
        alert('請先登入錢包');
        return;
    }

    var message = $('#verify_sign_message').val();

    if (message == '') {
        alert('請輸入欲驗證的字串');
        return;
    }

    var signature = $('#sign_result').text();

    if (signature == '' || signature == undefined) {
        alert('請先簽名');
        return;
    }

    AppendLog(`正在驗證簽名...`);

    await ethereum.request({
        method: 'personal_ecRecover',
        params: [message, signature]
    })
    .then((result) => {
        console.log(result);
        AppendLog(`正在驗證簽名. result=${result}`);

        $('#verify_result').text(result == ethereum.selectedAddress);
    })
    .catch((error) => {
        console.log(error);
        AppendLog(`正在驗證簽名. error.message=${error.message}`);
    })
}

// 送出交易至指定地址
async function SendTrans() {

    if (!IsMetaMaskInstalled())
        return;

    if (ethereum.selectedAddress == null) {
        alert('請先登入錢包');
        return;
    }

    if ($('#send_address').val() == '') {
        alert('請輸入欲轉入的地址');
        return;
    }
    
    AppendLog(`送出交易至指定地址...`);

    // 將值填入參數 Table 中
    $('#send_to').text($('#send_address').val());

    const params = [{
        nonce: '0x00',  // 即使傳送此值也會被 MetaMask 忽略
        gasPrice: '', // 這邊代入的值是 10000000000000
        gas: '', // 這邊代入的值是 10000 (網站建議的 gas fee)
        to: $('#send_address').val(),
        from: ethereum.selectedAddress, // 用戶當前選擇的錢包地址
        value: '2386F26FC10000', // (10000000000000000)
        data: '', // 好像沒用
        chainId: '0x2a', // Kavon Testnet
    }]

    await ethereum.request({
        method: 'eth_sendTransaction',
        params: params
    })
    .then((result) => {
        console.log(result);
        AppendLog(`送出交易至指定地址. result=${result}`);
    })
    .catch((error) => {
        console.log(error);
        AppendLog(`送出交易至指定地址. error.message=${error.message}`);
    })
}

// 測試中
async function Test() {

    alert('當前未有在進行中的測試');
    return;
}



// ---------- 監聽事件 ---------- //
// 當選擇的地址變更時
ethereum.on('accountsChanged', handleAccountsChanged);
function handleAccountsChanged(accounts) {
    AppendLog(`錢包地址變更: ${ethereum.selectedAddress}`);
    $('#metamask_address').text(ethereum.selectedAddress);
    $('#send_from').text(ethereum.selectedAddress);
}
// 移除監聽
//ethereum.removeListener('accountsChanged', handleAccountsChanged)

// 當選擇的鏈網路變更時
ethereum.on('chainChanged', (chainId) => {
    AppendLog(`鏈網路變更: ${parseInt(ethereum.chainId, 16)}`);
    $('#metamask_network').text(`${parseInt(ethereum.chainId, 16)}`);
});

// ---------- Core ---------- //
// Log
function AppendLog(text) {
    $('#event-log').html(`${$('#event-log').html()}<div><label>${new Date().timeNow()}  ${text}</label></div>`);
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}