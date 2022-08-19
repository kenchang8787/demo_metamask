$(document).ready(function () {
  IsMetaMaskInstalled();
});

// 顯示 README 頁面
function ShowReadMe() {
  window.location = "./README.md";
}

// 基本資訊
function IsMetaMaskInstalled() {
  var isMobile = IsMobile();

  // 判斷用戶是否為手機裝置
  $("#user_agent").text(isMobile ? "手機" : "電腦");
  // 手機不顯示額外資訊
  if (isMobile) {
    $(".desc").hide();
    $(".mobile").hide();
  }

  // 判斷是否連線以太坊
  if (typeof window.ethereum == "undefined") {
    // 若是小網, 且未連線以太坊, 隱藏 website 功能, 顯示 mobile 功能
    if (isMobile) {
      $(".website").hide();
      $(".mobile").show();
    }

    return false;
  }

  $("#ethereum_connected").text("已連線以太坊");

  // 判斷安裝狐狸錢包
  if (!ethereum.isMetaMask) return false;

  $("#metamask_installed").text("已安裝MetaMask");

  return true;
}
// -- 判斷是否為手機裝置
function IsMobile() {
  var isMobile = false;

  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent,
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      navigator.userAgent.substr(0, 4),
    )
  ) {
    isMobile = true;
  }

  return isMobile;
}

// 測試
async function Test() {
  var descId = "#test_desc";

  showInDesc(descId, `目前沒有欲測試的功能`, true);

  return;
}

// 登入錢包
async function ConnectWallet() {
  var descId = "#wallet_desc";

  if (!IsMetaMaskInstalled()) {
    showInDesc(descId, "尚未與以太坊建立連線", true);
    return;
  }

  if (ethereum.selectedAddress != null) {
    $("#wallet_address").text(ethereum.selectedAddress);
    $("#metamask_network").text(`${parseInt(ethereum.chainId, 16)}`);
    GetBalance();
    return;
  }

  showInDesc(descId, "登入錢包...", true);

  // 若尚未連線至metamask錢包, 會跳出請求視窗
  await ethereum
    .request({
      method: "eth_requestAccounts",
    })
    .then(result => {
      console.log(result);
      showInDesc(descId, `登入錢包. result=${result}`);
    })
    .catch(error => {
      console.log(error);
      showInDesc(descId, `登入錢包. error.message=${error.message}`);
    })
    .finally(() => {
      $("#metamask_network").text(`${parseInt(ethereum.chainId, 16)}`);
    });
}
// -- 取得餘額
async function GetBalance() {
  var descId = "#wallet_desc";

  showInDesc(descId, "取得餘額...");

  await ethereum
    .request({
      method: "eth_getBalance",
      params: [ethereum.selectedAddress, "latest"],
    })
    .then(result => {
      console.log(result);
      $("#wallet_balance").text(parseInt(result, 16));
      showInDesc(descId, `獲取錢包餘額. result=${parseInt(result, 16)}`);
    })
    .catch(error => {
      console.log(error);
      showInDesc(descId, `獲取錢包餘額. error.message=${error.message}`);
    });
}
// -- [監聽事件] 當選擇的地址變更時
ethereum.on("accountsChanged", handleAccountsChanged);
function handleAccountsChanged(accounts) {
  var descId = "#wallet_desc";

  showInDesc(descId, `錢包地址變更: ${ethereum.selectedAddress}`);
  $("#wallet_address").text(ethereum.selectedAddress);

  GetBalance();
}
// -- [監聽事件] 移除監聽
//ethereum.removeListener('accountsChanged', handleAccountsChanged)
// -- [監聽事件] 當選擇的鏈網路變更時
ethereum.on("chainChanged", chainId => {
  var descId = "#wallet_desc";
  showInDesc(descId, `鏈網路變更: ${parseInt(ethereum.chainId, 16)}`);
  $("#metamask_network").text(`${parseInt(ethereum.chainId, 16)}`);

  descId = "#switch_network_desc";
  showInDesc(descId, `鏈網路變更: ${parseInt(ethereum.chainId, 16)}`);

  descId = "#add_network_desc";
  showInDesc(descId, `鏈網路變更: ${parseInt(ethereum.chainId, 16)}`);

  GetBalance();
});

// 連線至指定網路
async function ConnectCustomNetwork() {
  var descId = "#switch_network_desc";

  if (!IsMetaMaskInstalled()) {
    showInDesc(descId, "尚未與以太坊建立連線", true);
    return;
  }

  var input = $("#swith_chainId").val();

  if (input == "" || input == undefined) {
    showInDesc(descId, "請輸入 chainId.", true);
    return;
  }

  var chainId = toHex(input);

  showInDesc(descId, `連線至指定網路...${chainId}`, true);

  await ethereum
    .request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: chainId,
        },
      ],
    })
    .then(result => {
      console.log(result);
      showInDesc(descId, `result=${result}`);
    })
    .catch(error => {
      console.log(error);
      showInDesc(descId, `error.message=${error.message}`);
    });
}

// 新增並連線至指定網路
async function AddConnectCustomNetwork() {
  var descId = "#add_network_desc";

  if (!IsMetaMaskInstalled()) {
    showInDesc(descId, "尚未與以太坊建立連線", true);
    return;
  }

  var chainId = toHex(56);

  showInDesc(descId, `新增並連線至指定網路...${chainId}`, true);

  await ethereum
    .request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chainId,
          chainName: "Binance Smart Chain Mainnet",
          nativeCurrency: { symbol: "BNB", decimals: 18 },
          rpcUrls: ["https://bsc-dataseed1.binance.org"],
          blockExplorerUrls: ["https://bscscan.com"],
        },
      ],
    })
    .then(result => {
      console.log(result);
      showInDesc(descId, `result=${result}`);
    })
    .catch(error => {
      console.log(error);
      showInDesc(descId, `error.message=${error.message}`);
    });
}

// 新增檢視的資產
async function AddAsset() {
  var descId = "#add_asset_desc";

  if (!IsMetaMaskInstalled()) {
    showInDesc(descId, "尚未與以太坊建立連線", true);
    return;
  }

  showInDesc(descId, `新增檢視的資產...`, true);

  await ethereum
    .request({
      method: "wallet_watchAsset",
      params: {
        type: $("#asset_type").val(),
        options: {
          address: $("#asset_address").val(),
          symbol: $("#asset_symbol").val(),
          decimals: parseInt($("#asset_decimals").val()),
        },
      },
    })
    .then(result => {
      console.log(result);
      showInDesc(descId, `result=${result}`);
    })
    .catch(error => {
      console.log(error);
      showInDesc(descId, `error.message=${error.message}`);
    });
}

// 取得其他資產
var jsonReader = $.getJSON("./json/bsc-eth.json");
async function GetAsset() {
  var descId = "#get_asset_desc";

  if (!IsMetaMaskInstalled()) {
    showInDesc(descId, "尚未與以太坊建立連線", true);
    return;
  }

  if (ethereum.selectedAddress == null) {
    showInDesc(descId, "請先登入錢包", true);
    return;
  }

  showInDesc(descId, `取得其他資產...`, true);

  var web3 = new Web3(window.ethereum);

  var jsonAbi = JSON.parse(jsonReader.responseText);
  var contractAddress = $("#get_accect_contract_addr").val();
  var tokenAddress = ethereum.selectedAddress;
  var token = new web3.eth.Contract(jsonAbi, contractAddress);

  var balance = await token.methods.balanceOf(tokenAddress);

  await balance
    .call()
    .then(result => {
      console.log(result);
      showInDesc(descId, `result=${result}`);
    })
    .catch(error => {
      console.log(error);
      showInDesc(descId, `error.message=${error.message}`);
    });
}

// 簽署
async function Sign() {
  var descId = "#sign_desc";

  if (!IsMetaMaskInstalled()) {
    showInDesc(descId, "尚未與以太坊建立連線", true);
    return;
  }

  if (ethereum.selectedAddress == null) {
    showInDesc(descId, "請先登入錢包", true);
    return;
  }

  showInDesc(descId, `正在簽署...`, true);

  var message = $("#sign_message").val();

  await ethereum
    .request({
      method: "personal_sign",
      params: [ethereum.selectedAddress, message],
    })
    .then(result => {
      console.log(result);
      showInDesc(descId, `result=${result}`);
    })
    .catch(error => {
      console.log(error);
      showInDesc(descId, `error.message=${error.message}`);
    });
}

// 驗證簽署
async function VerifySign() {
  var descId = "#verfiy_sign_desc";

  if (!IsMetaMaskInstalled()) {
    showInDesc(descId, "尚未與以太坊建立連線", true);
    return;
  }

  if (ethereum.selectedAddress == null) {
    showInDesc(descId, "請先登入錢包", true);
    return;
  }

  showInDesc(descId, `正在驗證簽署...`, true);

  var message = $("#verify_sign_message").val();
  var signature = $("#verify_sign_signature").val();

  await ethereum
    .request({
      method: "personal_ecRecover",
      params: [message, signature],
    })
    .then(result => {
      console.log(result);
      showInDesc(descId, `result=${result}`);
      showInDesc(descId, `驗證結果=${result == ethereum.selectedAddress}`);
    })
    .catch(error => {
      console.log(error);
      showInDesc(descId, `error.message=${error.message}`);
    });
}

// 執行交易
async function SendTrans() {
  var descId = "#send_trans_desc";

  if (!IsMetaMaskInstalled()) {
    showInDesc(descId, "尚未與以太坊建立連線", true);
    return;
  }

  if (ethereum.selectedAddress == null) {
    showInDesc(descId, "請先登入錢包", true);
    return;
  }

  showInDesc(descId, `正在送出交易...`, true);

  // 填入說明欄位值
  $("#send_from").html(ethereum.selectedAddress);
  $("#send_to").html($("#send_trans_address").val());

  // 金額
  var amount = parseFloat($("#send_trans_amount").val()) * 1000000000000000000;

  const params = [
    {
      nonce: "0x00", // 即使傳送此值也會被忽略
      gasPrice: "", // 這邊代入的值是 10000000000000
      gas: "", // 這邊代入的值是 10000 (網站建議的 gas fee)
      to: $("#send_trans_address").val(),
      from: ethereum.selectedAddress, // 用戶當前選擇的錢包地址
      value: toHex(amount),
      data: $("#send_trans_data").val(), // 好像沒用
      chainId: "0x2a", // Kavon Testnet
    },
  ];

  await ethereum
    .request({
      method: "eth_sendTransaction",
      params: params,
    })
    .then(result => {
      console.log(result);
      showInDesc(descId, `result=${result}`);
    })
    .catch(error => {
      console.log(error);
      showInDesc(descId, `error.message=${error.message}`);
    });
}

// 打開 DeepLink
async function DeepLink() {
  var descId = "#deeplink_desc";

  if (!IsMobile()) {
    showInDesc(descId, "電腦版開DeepLink沒用啦", true);
    return;
  }

  window.location = "https://metamask.app.link/dapp/kenchang8787.com";
}

// -- 顯示執行結果
function showInDesc(descId, text, clear) {
  if (clear) {
    $(descId).html(`${new Date().timeNow()} ${text}`);
  } else {
    $(descId).html(`${$(descId).html()}<br>${new Date().timeNow()} ${text}`);
  }
}
// -- 整數字串轉為16進位
function toHex(input) {
  var integer = parseInt(input);

  var hex = integer.toString(16);

  return `0x${hex}`;
}
// -- For the time now
Date.prototype.timeNow = function () {
  return (
    (this.getHours() < 10 ? "0" : "") +
    this.getHours() +
    ":" +
    (this.getMinutes() < 10 ? "0" : "") +
    this.getMinutes() +
    ":" +
    (this.getSeconds() < 10 ? "0" : "") +
    this.getSeconds()
  );
};
