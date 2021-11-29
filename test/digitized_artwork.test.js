const assert = require("assert");
const digitized_artwork = artifacts.require("digitized_artwork");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('digitized_artwork', (accounts) => {
    let nft_art

    before(async() => {
        nft_art = await digitized_artwork.deployed()
        console.log("contract address: " + nft_art.address)
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = nft_art.address

            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, undefined)
            assert.notEqual(address, null)
        })
    })

    describe('Minting', async () => {
        it('minting successfully', async () => {
            //TODO: Confirm test for safeMint
            const tokenID = await nft_art.safeMint('0x6E9203024dc7BD6C4F114f09A37aFE6ad72545d6', '123')
            console.log('tokenID: ' + tokenID)

            assert.notEqual(tokenID, 0)
            // tokenID.should.be.greaterThan(0)
        })
    })

})
