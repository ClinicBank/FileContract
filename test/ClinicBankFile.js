const ClinicBankFile = artifacts.require("ClinicBankFile");

contract("ClinicBankFile", async (accounts) => {
    let contractInstance
    const sampleHash = 'bafybeibt4hivsojxcahvpgelm2ifh42vrnidajcikafweo35ny3t2ypiua';
    const account = accounts[0]
    const title = 'First file'


    it('should deploy to the blockchain', () => {
        ClinicBankFile.deployed()
            .then(instance => {
                contractInstance = instance
                const address = instance.address

                assert.notEqual(address, 0x0)
                assert.notEqual(address, '')
                assert.notEqual(address, null)
                assert.notEqual(address, undefined)
            })
    })

    it('should have correct name', async () => {
        assert.equal(await contractInstance.name(), 'ClinicBank File')
    });

    it('should send file', () => {
        return contractInstance.sendFile.call('', title, { from: account })
            .then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0, 'Required file hash')
                return contractInstance.sendFile.call(sampleHash, '', { from: account })
            }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0, 'Required file title')
                return contractInstance.sendFile(sampleHash, title, { from: account })
            }).then(async (receipt) => {
                const logs = receipt.logs
                const event = logs[0].event
                const params = logs[0].args
                assert.equal(logs.length, 1, 'triggers one event')
                assert.equal(event, 'FileSent', 'should fire the "FileSent" event')
                assert.equal(params.id.toNumber(), (await contractInstance.fileCount()).toNumber(), 'ID is correct')
                assert.equal(params.title, title, 'Title is correct')
                assert.equal(params.owner, account, 'File owner is correct')
                assert.equal(params.hash, sampleHash, 'File hash is correct')
            })
    })

    it('should list files', () => {
        return contractInstance.fileCount()
            .then(async (fileCount) => {
                let files = []
                for (let i = 0; i <= fileCount; i++) {
                    const file = await contractInstance.files(i)
                    if (file[0] && file[1] && file[2]) {
                        files.push({
                            id: file[0].toNumber(),
                            hash: file[1],
                            title: file[2],
                            owner: file[3]
                        })
                    }
                }

                return files
            }).then(files => {
                assert(files.length > 0, 'Got atleast one file')
                assert.equal(files[0].id, 1, 'Formatted ID correctly')
                assert.equal(files[0].hash, sampleHash, 'Formatted Hash correctly')
                assert.equal(files[0].title, title, 'Formatted Title correctly')
                assert.equal(files[0].owner, account, 'Formatted owner correctly')
            })
    })
});
