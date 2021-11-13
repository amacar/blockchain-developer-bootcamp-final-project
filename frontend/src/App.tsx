import "./App.css";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

function App() {
  const { activateBrowserWallet, account, error } = useEthers();
  const etherBalance = useEtherBalance(account);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
      <button onClick={() => activateBrowserWallet()}>Connect</button>
      {account && <p>Account: {account}</p>}
      {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default App;
