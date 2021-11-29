const Digitized_Art = artifacts.require('digitized_artwork')

module.exports = function (deployer) {
    deployer.deploy(Digitized_Art, "Digitized_Artwork", "DART")
};
