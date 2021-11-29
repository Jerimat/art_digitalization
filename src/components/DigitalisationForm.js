import React from "react";
import Web3 from "web3"
import { create } from "ipfs-http-client";

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http'})

class DigitalisationForm extends React.Component {
    constructor() {
        super();
        this.state = {
            buffer: null,
            ipfsAddress: 'http://localhost:8080/ipfs/',
            // ipfsAddress: 'ipfs://', //TODO: Check network config to enable GET (This address doesn't work on Chrome)
            artwork: {
                description: '',
                image: '',
                name: ''
                // TODO: Add possibility to define attributes
            }
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    sendData = () => {
        this.props.parentCallback(this.state.ipfsAddress + this.state.artwork.image)
    }

    captureFile = (event) => {
        event.preventDefault()
        // Process file for IPFS
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({buffer: Buffer(reader.result)})
        }
    }

    onChange(event) {
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
        const cid = await ipfs.add(jsonContent, {
            cidVersion: 1,
            hashAlg: 'sha2-256'}
        )
        return cid.path
    }

    addToBlockchain = async (pathMetadata) => {
        const web3 = new Web3(Web3.givenProvider)
        const contract = this.props.dataFromParent
        web3.eth.getAccounts().then((accounts) => {
            contract.methods.safeMint(accounts[0], pathMetadata).send({ from: accounts[0] }).then(() => {
                console.log('You minted the NFT!')
            })
        })
  }

    onSubmit = async (event) => {
        event.preventDefault()
        console.log('Submitting the form')
        // Add the artwork and metadata to IPFS
        const pathMetadata = await this.addToIPFS()
        // Create and add the NFT on the Blockchain
        await this.addToBlockchain(pathMetadata)
        this.sendData()
    }

    render() {
        return (
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
        )
    }
}

export default DigitalisationForm
