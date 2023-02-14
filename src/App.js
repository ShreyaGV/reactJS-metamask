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
import Toast from 'react-bootstrap/Toast';
import { networks, addChain } from './utils/constants'; 

function App() {
  const [btnText,setBtnText] = useState('');
  const [account,setAccount] = useState();
  const [balance,setBalance] = useState(0);
  const [networkID,setNetworkID] = useState();
  const [networkName,setNetworkName] = useState('');
  const [error,setError] = useState();
  const [connectionSuccess,setConnectionSuccess] = useState(false);
  const [disableTransact,setDisableTransact] = useState(false);
  const [copyHashBtn,setCopyHashBtn] = useState(true);
  const [showA,setShowA] = useState(false);
  const [toastMsg,setToastMsg] = useState('');
  const [link,setLink] = useState('');
  const [hash,setHash] = useState('');
  const network = useRef(networkName);

  const provider = window.web3.currentProvider;
  const web3 = new Web3(provider);

  useEffect(()=>{
      if((window.ethereum && window.ethereum.isMetaMask) || (window.web3) ){
        setBtnText("Connect");
        const accountWasChanged = async(accounts) => {
          setAccount(accounts[0]);
          let balance = await web3.eth.getBalance(accounts[0]);
          balance = await web3.utils.fromWei(balance, 'ether');
          balance = balance + " ETH";
          setBalance(balance);
        }
        const getAndSetAccount = async () => {
          const changedAccounts = await web3.eth.requestAccounts();
          setAccount(changedAccounts[0]);
        }
        const clearAccount = () => {
          setAccount('');
        };
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
        window.ethereum.on('accountsChanged', accountWasChanged);
        window.ethereum.on('connect', getAndSetAccount);
        window.ethereum.on('disconnect', clearAccount);
        if(window.ethereum.isConnected()){
          onClickConnect();
        }
      }else{
        setBtnText("Click here to install MetaMask!")
      }    
  },[]);

  const toggleShowA = () => setShowA(!showA);

  const onClickConnect = async() => {
    if(btnText === "Click here to install MetaMask!"){
      window.open("https://metamask.io/download/", '_blank');
    }else{
      try {
        // const response = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        // setAccount(accounts[0]);
        // const userAccount = await web3.eth.getAccounts();
        const userAccount = await web3.eth.requestAccounts();
        console.log("==============",userAccount);
        const account = userAccount[0];
        setAccount(account);
        let balance = await web3.eth.getBalance(account);
        balance = await web3.utils.fromWei(balance, 'ether');
        balance = balance + " ETH";
        setBalance(balance);
        await web3.eth.net.getId()
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
    setNetworkName(networks[id]);
    return networks[id];
  }

  const onSwitch = async() => {
    if (networkID !== network.current.value) {
      try {
        await web3.currentProvider.request({
          method: 'wallet_switchEthereumChain',
            params: [{ chainId: Web3.utils.toHex(network.current.value) }],
          });
        setNetworkID(network.current.value);
      } catch (switchError) {
          try{
            let params = addChain[network.current.value]
            window.ethereum.request({
              id: 1,
              jsonrpc: "2.0",
              method: 'wallet_addEthereumChain',
              params: [params]
            })
            .catch((error) => {
                console.log("==",error)
            }) 
          }catch(error){
            console.log("====",error);
            setError(error)
          }
          if(switchError.code === 4001){
            setError(switchError);
          }else{
            setToastMsg(switchError.message);
            console.log("======ERRORRRRR");
            setShowA(true);
          }
      }
    }
    onClickConnect();
  }

  const payMeta = async(sender, receiver, strEther) => {
    try {
      const params = {
          from: sender,
          to: receiver,
          value: (strEther)* 10**18,
          gas: 39000
      };
      await window.ethereum.enable();
      window.web3 = new Web3(window.ethereum);    
      window.web3.eth.sendTransaction(params)
        .once('transactionHash', function(hash){
          console.log('txnHash is ' + hash);
          setHash(hash);
          const link = addChain[networkID].blockExplorerUrls + 'tx/' + hash;
          setLink(link);
          setCopyHashBtn(false);
          setDisableTransact(false);
        })
        .on('confirmation',async function(){
          let balance = await web3.eth.getBalance(account);
          balance = await web3.utils.fromWei(balance, 'ether');
          balance = balance + " ETH";
          setBalance(balance);
        });
    } catch(e) {
      console.log("payment fail!",e);
    }
  }
  const handleSubmit = (receiver,amt) => {
    setDisableTransact(true);
    if(account !== receiver){
      payMeta(account, receiver, amt);
    }else{
      setError({message:"Sender and receiver's address cannot be the same"});
    }
  }

  const copyHash = () => {
    navigator.clipboard.writeText(hash);
    alert("Copied the text: " + hash);
  }

  return (
    <div className="App">
      <header className="App-header">
      {error && 
        <Modal error={error} handleClose={()=>{setError('')}}/>
      }
      {toastMsg && 
        <Toast show={showA} onClose={toggleShowA} bg='dark' autohide delay={1000} className='Light'>
          <Toast.Body>{toastMsg}</Toast.Body>
        </Toast>
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
                <option value="1" disabled={networkName === "Ethereum Mainnet"? true : false}>Ethereum Mainnet</option>
                <option value="97" disabled={networkName === "BNB Smart Chain Testnet"? true : false}>BNB Smart Chain Testnet</option>
                <option value="56" disabled={networkName === "Binance Smart Chain Mainnet"? true : false}>Binance Smart Chain Mainnet</option>
                <option value="137" disabled={networkName === "Matic(Polygon) Mainnet"? true : false}>Matic(Polygon) Mainnet</option>
                <option value="80001" disabled={networkName === "Mumbai"? true : false}>Mumbai</option>
            </Form.Select>
            </Col>
          </Form.Group>}
          <Transaction handleSubmit={handleSubmit} disableTransact={disableTransact}/>
          <Form.Group as={Row} className="mb-3 mt-3 hash" controlId="formHorizontalEmail">
            <Form.Label column sm={3}>
                Hash
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" placeholder={hash} readOnly/>
            </Col>
          </Form.Group>
          <div className='d-flex'>
            <Button onClick={copyHash} disabled={copyHashBtn} variant="outline-dark" size='lg'>Copy Hash</Button>
            {!copyHashBtn && <div className="m-auto px-3"><a className='text-decoration-none text-white'href={link}>View Log</a></div>}
          </div>
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