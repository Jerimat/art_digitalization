import React, {Component} from 'react';
import DigitalisationForm from './components/DigitalisationForm';
import Digitized_Artwork from './abi/digitized_artwork.json'
import Web3 from 'web3'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURI: '',
      contract: null
    };
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const networkID = await web3.eth.net.getId()
    const networkData = Digitized_Artwork.networks[networkID]

    if(networkData) {
      const abi = Digitized_Artwork.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
    } else {
      window.alert('Smart contract not deployed to detected network!')
    }
}

  // Connect to the Web3
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Please use Metamask!')
    }
  }

  getImageURI = (nftImageURI) => {
    //TODO: Error when trying to fetch the image uploaded on IPFS ("GET [img_address] net::ERR_BLOCKED_BY_CLIENT")
    this.setState({imageURI: nftImageURI})
  }

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <>
              <img src={this.state.imageURI}/>
              <h2>NFT upload form</h2>
              <DigitalisationForm parentCallback={this.getImageURI} dataFromParent={this.state.contract}/>
            </>
          </header>
        </div>
    )
  };
}

export default App;
