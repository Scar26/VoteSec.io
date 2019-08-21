pragma solidity ^0.5.0;
import "./provable.sol";

contract Election is usingProvable{

  struct Candidate{
    uint32 id;
    string name;
    uint votes;
  }

  mapping(uint => bool) private voted;
  mapping(uint => Candidate) public candidates;
  uint32 public cancount;

  event temp(string response);

  constructor() public{
    newCandidate("Salad Ass");
    newCandidate("Black Donald Trump");
    newCandidate("Keanu Reaves");

  }

  function verifyVoter(uint voterid) private returns(bool){
    return true;
  }

  function castVote(uint vid, uint cid) public returns(string memory){
    if (verifyVoter(vid) == false){
      return "Not a valid Voter ID";
    }

    else{
      if(voted[vid] != true){
        voted[vid] = true;
        recordVote(cid);
      }
      return "Your vote has been recorded successfully";
  }
}

  function newCandidate(string memory _name) private{
    candidates[cancount] = Candidate(cancount, _name, 0);
    cancount++;
  }

  function recordVote(uint _id) private{
    candidates[_id].votes++;
  }

  function __callback(bytes32 queryID, string memory result) public{
    if(msg.sender != provable_cbAddress()) revert();
    emit temp(result);
  }

  function testOracle() public payable{
    provable_query("URL","json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price");
  }
}
