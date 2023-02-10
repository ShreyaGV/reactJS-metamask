import metamask from './metamask.png';
import './App.css';
import Button from 'react-bootstrap/Button'
import Modal from './Modal';
import Web3 from 'web3';
import CustomForm from './Form/Form';
import Transaction from './Transaction/Transaction';
import { useEffect, useState, Fragment, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const [btnText,setBtnText] = useState('Click here to install MetaMask!');
  const [account,setAccount] = useState();
  const [balance,setBalance] = useState(0);
  const [networkID,setNetworkID] = useState();
  const [networkName,setNetworkName] = useState('');
  const [error,setError] = useState();
  const [connectionSuccess,setConnectionSuccess] = useState(false);
  const [hash,setHash] = useState('');
  const network = useRef(networkName);
  // const provider = window.web3.currentProvider;
  // const web3 = new Web3(provider);

  useEffect(()=>{
      if((window.ethereum && window.ethereum.isMetaMask) || (window.web3) ){
        setBtnText("Connect");
      }else{
        setBtnText("Click here to install MetaMask!")
      }
  },[]);

  const onClickConnect = async() => {
    if(btnText === "Click here to install MetaMask!"){
      window.open("https://metamask.io/download/", '_blank');
    }else{
      try {
        // const response = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        // setAccount(accounts[0]);
        const provider = window.web3.currentProvider;
        const web3 = new Web3(provider);
        const userAccount = await web3.eth.getAccounts();
        console.log("==============",userAccount);
        const account = userAccount[0];
        setAccount(account);
        let balance = await web3.eth.getBalance(account);
        // balance = parseInt(balance)/1000000000000000000 + " ETH";
        balance = await web3.utils.fromWei(balance, 'ether');
        balance = balance + " ETH";
        setBalance(balance);
        const networkID = await web3.eth.net.getId()
          .then((id)=>{
            setNetworkID(id);
            getNetworkName(id);
          });
        setConnectionSuccess(true);
      } catch (error) {
        console.log("============",error);
        setError(error);
      }
    }
  }

  const getNetworkName = (id) => {
    let networks = {
      1: "Ethereum Mainnet",
      97: "BNB Smart Chain Testnet",
      80001: "Mumbai"
    };
    setNetworkName(networks[id]);
    return networks[id];
  }

  const onSwitch = async() => {
    if (networkID !== network.current.value) {
      try {
        const provider = window.web3.currentProvider;
        const web3 = new Web3(provider);
        await web3.currentProvider.request({
          method: 'wallet_switchEthereumChain',
            params: [{ chainId: Web3.utils.toHex(network.current.value) }],
          });
        setNetworkID(network.current.value);
      } catch (switchError) {
          setError(switchError);
      }
    }
    onClickConnect();
  }

  const payMeta = async(sender, receiver, strEther) => {
    try {
      const params = {
          from: sender,
          to: receiver,
          value: strEther,
          gas: 39000
      };
      await window.ethereum.enable();
      window.web3 = new Web3(window.ethereum);    
      const sendHash = window.web3.eth.sendTransaction(params)
        .once('transactionHash', function(hash){
          console.log('txnHash is ' + hash);
          setHash(hash);
        });
    } catch(e) {
        console.log("payment fail!");
        console.log(e);
    }
  }
  const handleSubmit = (receiver,amt) => {
    payMeta(account, receiver, amt);
  }

  return (
    <div className="App">
      <header className="App-header">
      {error && 
        <Modal error={error} handleClose={()=>{setError('')}}/>
      }
      {account ? 
        <Fragment>
          <img src={metamask} className="logo-sm" alt="logo" />
          <CustomForm account={account} balance={balance} networkID={networkID} networkName={networkName}/>
          {connectionSuccess && networkName &&
          <Form.Group as={Row} className="mb-3 switch" controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
                Switch Network
            </Form.Label>
            <Col sm={9}>
            <Form.Select ref={network} onChange={onSwitch}>
                {/* <option disabled={true}>Switch you network</option> */}
                <option value="1" disabled={networkName === "Ethereum Mainnet"? true : false}>Ethereum Mainnet</option>
                <option value="97" disabled={networkName === "BNB Smart Chain Testnet"? true : false}>BNB Smart Chain Testnet</option>
                <option value="80001" disabled={networkName === "Mumbai"? true : false}>Mumbai</option>
            </Form.Select>
            </Col>
          </Form.Group>}
          <Transaction handleSubmit={handleSubmit}/>
          <Form.Group as={Row} className="mb-3 mt-3 hash" controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
                Hash
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" placeholder={hash} readOnly/>
            </Col>
        </Form.Group>
        </Fragment>
        :
        <Fragment>
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
