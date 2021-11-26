import React, {Component} from 'react';
import { create } from 'ipfs-http-client'
import './App.css';
import * as path from "path";

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http'})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      ipfsAddress: 'http://localhost:8080/ipfs/',
      // ipfsAddress: 'ipfs://', //TODO: Check network config to enable GET (This address doesn't work on Chrome)
      artwork: {
        name: '',
        description: '',
        image: ''
        // TODO: Add possibility to define attributes
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

  onChange = (event) => {
    // event.preventDefault()
    const {name, value} = event.target
    this.setState({
      artwork: {
        ...this.state.artwork,
        [name]: value
      }
    })
  }

  addToIPFS = async () => {
    // Add the image to IPFS
    await ipfs.add(this.state.buffer,{
      cidVersion: 1,
      hashAlg: 'sha2-256'
    }).then((response) => {
      const value = response.path
      this.setState({
        artwork: {
          ...this.state.artwork,
          image: value
        }
      })
    })
    // Add the NFT metadata to IPFS
    const jsonContent = JSON.stringify(this.state.artwork)
    console.log(jsonContent)
    const cid = await ipfs.add(jsonContent, {
      cidVersion: 1,
      hashAlg: 'sha2-256'}
    )
    return cid.path
  }

  addToBlockchain = async (pathMetadata) => {
    //TODO (communicate with the smart contract)
    console.log(pathMetadata)
  }

  onSubmit = async (event) => {
    event.preventDefault()
    console.log('Submitting the form')
    // Add the artwork and metadata to IPFS
    const pathMetadata = await this.addToIPFS()
    // Create and add the NFT on the Blockchain
    await this.addToBlockchain(pathMetadata)
  }

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <>
              <img src={this.state.ipfsAddress + this.state.artwork.image}/>
              <h2>NFT upload form</h2>
              <div className="ArtworkForm">
                <form method='post' onSubmit={this.onSubmit}>
                  <label>Artwork Name</label>
                  <input type="text" placeholder="Artwork name" name="name" onChange={this.onChange}/>
                  <label>Description</label>
                  <textarea placeholder="Description" name="description" onChange={this.onChange}/>
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
