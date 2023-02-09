import metamask from './metamask.png';
import './App.css';
import Button from 'react-bootstrap/Button'
import Modal from './Modal';
// import  from '';
import { useEffect, useState, Fragment } from 'react';

function App() {
  const [btnText,setBtnText] = useState('Click here to install MetaMask!');
  const [account,setAccount] = useState();
  const [error,setError] = useState();

  useEffect(()=>{
      if(window.ethereum && window.ethereum.isMetaMask){
        setBtnText("Connect");
      }else{
        setBtnText("Click here to install MetaMask!")
      }
  },[]);

  const onClickConnect = async() => {
    console.log("On Click connect");
    if(btnText === "Click here to install MetaMask!"){
      window.open("https://metamask.io/download/", '_blank');
    }else{
      console.log("Metamask already installed");
      try {
        // const web3 = new Web3(window.ethereum);
        let response = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("🚀 ~ file: App.js:25 ~ onClickConnect ~ ̥",response);
        let accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log("🚀 ~ file: App.js:25 ~ onClickConnect ~ ̥",accounts);
        // var accountsWeb3 = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const balance = await window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']});
        console.log("==============!!!",balance);
      } catch (error) { 
        setError(error);
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
      {account ? 
        <div>
          <h2>Wallet Address : {account}</h2> 
        </div>
        :
        <Fragment>
          {error && 
            <Modal error={error} handleClose={()=>{setError('')}}/>
          }
          <div>
            <img src={metamask} className="logo" alt="logo" />
          </div>
          <Button id="connectButton" onClick={onClickConnect} variant="outline-dark" size='lg' className='btn'>{btnText}</Button>
        </Fragment>
      }
      </header>
    </div>
  );
}

export default App;
