
// Deep Link
function MetaMaskDeepLink() {
    window.location='https://metamask.app.link/dapp/kenchang8787.com';
}

// 官方提供的偵測
function MetaMaskDetect() {
    if (window.ethereum) {
        handleEthereum();
      } else {
        window.addEventListener('ethereum#initialized', handleEthereum, {
          once: true,
        });
      
        // If the event is not dispatched by the end of the timeout,
        // the user probably doesn't have MetaMask installed.
        setTimeout(handleEthereum, 3000); // 3 seconds
      }
      
      function handleEthereum() {
        const { ethereum } = window;
        if (ethereum && ethereum.isMetaMask) {
          console.log('Ethereum successfully detected!');
          $('#ethereum_installed').val('true');
          // Access the decentralized web!
        } else {
          console.log('Please install MetaMask!');
          $('#ethereum_installed').val('false');
        }
      }
}