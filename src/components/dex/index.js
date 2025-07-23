import { useEffect, useState } from "react";
import "./index.css";
import Web3 from "web3";

function DecentralizedExchangeSection() {
  const [amount, setAmount] = useState("");
  const [receipientAddress, setReceipientAddress] = useState("");
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [status, setStatus] = useState("");
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const _web3 = new Web3(window.ethereum);
      setWeb3(_web3);
    } else {
      alert("Please install MetaMask!");
    }

    try {
      setConnectingWallet(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      getBalance(accounts[0]);
      setConnectingWallet(false);
    } catch (err) {
      console.error("Wallet connection failed", err);
      setConnectingWallet(false);
    }
  };

  const disconnectWallet = () => {
    if (!web3) return;
    setAccount("");
    setWeb3(null);
    setBalance("");
    setStatus("");
  };

  const getBalance = async (accountAddr) => {
    if (!web3) return;
    setLoadingBalance(true);
    const weiBalance = await web3.eth.getBalance(accountAddr);
    const eth = web3.utils.fromWei(weiBalance, "ether");
    setBalance(parseFloat(eth).toFixed(4));
    setLoadingBalance(false);
  };

  const handleSendToken = async (e) => {
    e.preventDefault();

    if (!web3) {
      alert("Wallet not connected. Please connect your wallet first.");
      return;
    }

    if (!account) {
      alert("No wallet account found. Please ensure your wallet is connected.");
      return;
    }

    if (!receipientAddress) {
      alert("Please enter a recipient address.");
      return;
    }

    if (!amount) {
      alert("Please enter the amount of ETH to send.");
      return;
    }

    try {
      setLoadingTransaction(true);
      const value = web3.utils.toWei(amount, "ether");
      const tx = await web3.eth.sendTransaction({
        from: account,
        to: receipientAddress,
        value,
      });

      setStatus(`Transaction successful! TX Hash: ${tx.transactionHash}`);
      getBalance(account);
      setLoadingTransaction(false);
    } catch (err) {
      setStatus(`Transaction failed: ${err.message}`);
      setLoadingTransaction(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const _web3 = new Web3(window.ethereum);
      setWeb3(_web3);
    }
  }, []);

  return (
    <div className="features_section layout_padding">
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-md-8 offset-md-2 text-center">
            <h2 className="text-uppercase text-primary">Send ETH</h2>
            {account ? (
              <button
                onClick={disconnectWallet}
                className="btn btn-danger mb-3"
              >
                Disconnect Wallet
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="btn btn-outline-primary mb-3"
              >
                {connectingWallet ? "Connecting wallet..." : "Connect Wallet"}
              </button>
            )}
            {account && (
              <>
                <p className="mb-1 text-white">
                  <strong>Account:</strong> {account}
                </p>
                <p className="text-white">
                  <strong>Balance:</strong>
                  {loadingBalance ? "Loading balance" : `${balance} ETH`}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form
              onSubmit={handleSendToken}
              className="border p-4 rounded shadow-sm bg-light"
            >
              <div className="mb-3">
                <label htmlFor="amount" className="form-label text-white">
                  Token Amount
                </label>
                <input
                  value={amount}
                  type="number"
                  id="amount"
                  className="form-control"
                  placeholder="Input token amount"
                  required
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="recipient" className="form-label text-white">
                  Recipient's Address
                </label>
                <input
                  value={receipientAddress}
                  type="text"
                  id="recipient"
                  className="form-control"
                  placeholder="Input recipient address"
                  required
                  onChange={(e) => setReceipientAddress(e.target.value)}
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  {loadingTransaction ? "Sending token..." : "Submit"}
                </button>
              </div>
              <p className="text-white">{status}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecentralizedExchangeSection;
