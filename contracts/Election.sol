pragma solidity ^0.5.0;

contract Election{

  struct Candidate{
    uint32 id;
    string name;
    uint votes;
  }
  mapping(uint => bool) private voted;
  mapping(uint => Candidate) public candidates;
  uint32 public cancount;
  address private admin;

  modifier onlyOwner {
    require(msg.sender == _owner);
    _;
  }

  constructor() public{
  	newCandidate('Bajendra Modi');
  	newCandidate('Pappu');
  	newCandidate('Jejriwal');
  	admin = msg.sender;
  }

  function castVote(string memory vid, uint cid) public onlyOwner returns(string memory){

      if(voted[vid] != true){
        voted[vid] = true;
        recordVote(cid);
      }
      return "Your vote has been recorded successfully";
}

  function newCandidate(string memory _name) private onlyOwner{
    candidates[cancount] = Candidate(cancount, _name, 0);
    cancount++;
  }

  function recordVote(uint _id) private{
    candidates[_id].votes++;
  }

  function concludeElection() onlyOwner private returns(bool success) {
  owner = address(0);
  return true;
}
}
