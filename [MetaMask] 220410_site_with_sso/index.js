

// Document Ready
$(document).ready(function () {

    // 若是未安裝MetaMask Plugin, 則請用戶去下載
    if (!IsMetaMaskInstalled()) {
        var goDownload = confirm('當前瀏覽器未安裝MetaMask, 是否前往下載?');

        if (goDownload) {
            window.open("https://metamask.io/download/", '_blank');
        }
        else {
            alert('未下載MetaMask擴充套件時, 有些功能無法使用');
        }

        return;
    }

    $('#metamask_address').text(ethereum.selectedAddress);
    $('#metamask_network').text(ethereum.networkVersion);

    // 當選擇的地址變更時
    ethereum.on('accountsChanged', (accounts) => {
        AppendLog(`address changed: ${ethereum.selectedAddress}`);
        $('#metamask_address').text(ethereum.selectedAddress);
    });

    // 當選擇的鏈網路變更時
    ethereum.on('chainChanged', (chainId) => {
        AppendLog(`network changed: ${ethereum.networkVersion}`);
        $('#metamask_network').text(ethereum.networkVersion);
    });
})

// Log
function AppendLog(text) {
    $('#event-log').html(`${$('#event-log').text()}<br>${new Date().timeNow()} ${text}`);
}

// 回傳是用戶的瀏覽器有安裝MetaMask的Plugin
function IsMetaMaskInstalled() {

    if (typeof (window.ethereum) == 'undefined') {
        $('#metamask_installed').text('未安裝');
        $('#metamask_ismetamask').text('否');
        $('#metamask_network').text('未連接');
        return false;
    }

    $('#metamask_installed').text('已安裝');
    $('#metamask_ismetamask').text('是')
    
    return true;
}

// 開啟 MetaMask Plugin , 連線至 MetaMask 錢包
async function ConnToMetaMask() {

    if (!IsMetaMaskInstalled())
        return;

    // 若未連結至MetaMask錢包, 會開啟MetaMask Plugin連結
    var accounts = await ethereum.request({ method: 'eth_requestAccounts' });
}

// 開啟錢包並設定網路
async function ConnCustomNetwork() {
    await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2a' }],
      })
}










// Core

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}