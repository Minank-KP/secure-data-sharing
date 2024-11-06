// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract SecureShare {
    mapping(address => string[]) public uploadedCIDs;
    mapping(address => string[]) public sharedCIDs;

    function addCID(string memory cid) public {
        uploadedCIDs[msg.sender].push(cid);
    }

    function getUploadedCIDs(address user) public view returns (string[] memory) {
        return uploadedCIDs[user];
    }

    function getSharedCIDs(address user) public view returns (string[] memory) {
        return sharedCIDs[user];
    }   

    function share(string memory cid, address recipient) public {
        sharedCIDs[recipient].push(cid);
    }
}