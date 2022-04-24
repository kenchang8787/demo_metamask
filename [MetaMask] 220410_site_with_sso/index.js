

// Document Ready
$(document).ready(function () {

    if (!IsMetaMaskInstalled()) {
        var goDownload = confirm('當前瀏覽器未安裝MetaMask, 是否前往下載?');

        if (goDownload) {
            window.open("https://metamask.io/download/", '_blank');
        }
        else {
            alert('未下載MetaMask擴充套件時, 有些功能無法使用');
        }
    }

})

// 回傳是用戶的瀏覽器有安裝MetaMask的Plugin
function IsMetaMaskInstalled() {

    if (typeof (window.ethereum) == 'undefined') {
        $('#metamask_installed').text('未安裝');
        $('#metamask_network').text('未連接');
        return false;
    }

    console.log(window.ethereum.isMetaMask);
    console.log(window.ethereum.networkVersion);
    console.log(window.ethereum.selectedAddress);

    $('#metamask_installed').text('已安裝');
    $('#metamask_network').text(ethereum.networkVersion);
    return true;
}

// 開啟 MetaMask Plugin , 連線至 MetaMask 錢包
async function ConnToMetaMask() {

    if (!IsMetaMaskInstalled())
        return;

    var accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    $('#metamask_adddress').text(ethereum.selectedAddress);
}