const SHA256 = require('crypto-js/sha256');    // import sha256 function
class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash  = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined" + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty= 4;
    }

    createGenesisBlock(){
        return new Block(0, "18/07/2024", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++)       // we start iterating from 1 because i=0 is the genesis block
        {
            const currentBlock = this.chain[i];       
            const previousBlock  = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}


let savjeeCoin = new Blockchain();

console.log('Mining Block 1...');
savjeeCoin.addBlock(new Block(1, "12/07/2024", { amount: 4}));

console.log('Mining Block 2...');
savjeeCoin.addBlock(new Block(2, "15/07/2024", { amount: 10}));


// console.log('Is BlockChain valid?' + savjeeCoin.isChainValid());

// //lets tamper with the data this time
// savjeeCoin.chain[1].data = { amount:100 };
// savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();      // it will recalculate the hash for the block whose data was changed, we won't get true even after this once data is altered in one of the blocks(relationship with previous blocks broken) 
//                                                                        //all blocks hash sequence need to be calculated again

// console.log('Is Bloclchain Valid?' + savjeeCoin.isChainValid());    //we'll get false for this time as data is altered causing hash sequenece to change
console.log(JSON.stringify(savjeeCoin, null, 4));      // using 4 spaces to format it
