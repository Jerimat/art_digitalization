import React, {Component} from 'react';
import { create } from 'ipfs-http-client'
import './App.css';

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http'})

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      ipfsAddress: 'http://localhost:8080/ipfs/',
      formData: {
        name: '',
        description: '',
        nftHash: ''
        //add possibility to define attributes
      }
    };
  }

  captureFile = (event) => {
    event.preventDefault()
    console.log('File captured')
    // Process file for IPFS
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})
    }
  }

  addToIPFS = () => {
    ipfs.add(this.state.buffer).then((response) => {
      const nftHash = response.path
      this.setState({ nftHash })
      console.log(nftHash)
    })
    console.log('Your NFT has been updated to IPFS!')
  }

  generateMetaData = () => {
    console.log()
  }

  addToBlockchain = () => {
    //TODO
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log('Submitting the form')
    // Add the artwork to IPFS
    this.addToIPFS()
    // Generate the Metadata for the artwork
    this.generateMetaData()
    // Add the Artwork Metadata on the Blockchain
    this.addToBlockchain()
  }

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <>
              <img src={this.state.ipfsAddress + this.state.nftHash}/>
              <h2>NFT upload form</h2>
              <div className="ArtworkForm">
                <form method='post' onSubmit={this.onSubmit}>
                  <label>Artwork Name</label>
                  <input type="text" placeholder="Artwork name" id="artwork_name" name="nameArtwork"/>
                  <label>Description</label>
                  <textarea placeholder="Description" id="artwork_description" name="descriptionArtwork"/>
                  <input type='file' onChange={this.captureFile}/>
                  <input type='submit'/>
                </form>
              </div>
            </>
          </header>
        </div>
    )
  };
}

export default App;
