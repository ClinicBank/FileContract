pragma solidity ^0.4.0;

contract ClinicBankFile {
    uint public fileCount = 0;
    string public name = 'ClinicBank File';
    address private owner;

    mapping(uint => File) public files;

    struct File {
        uint id;
        string hash;
        string title;
        address owner;
    }

    // Events
    event FileSent(
        uint id,
        string hash,
        string title,
        address owner
    );

    // Modifiers
    modifier hashExist (string memory _hash) {
        bytes memory fileHash =  bytes(_hash);
        require (fileHash.length > 0, 'File hash is required.');
        _;
    }

    modifier titleExist (string memory _title) {
        bytes memory fileTitle =  bytes(_title);
        require(fileTitle.length > 0, 'File title is required.');
        _;
    }

    constructor() { owner = msg.sender; }

    function sendFile(string memory _hash, string memory _title) hashExist(_hash) titleExist(_title) public {
        require(owner != address(0), 'Unauthorized request.');
        fileCount++;

        files[fileCount] = File(fileCount, _hash, _title, owner);
        emit FileSent(fileCount, _hash, _title, owner);
    }
}
