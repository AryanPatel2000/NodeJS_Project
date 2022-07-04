
randomNumber = (length)  => {

    var result  = '';
    var characters  = '0123456789ABCDEFGHIJKLMNOPabcdefghijklmnop';

    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {

      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

    console.log(`Random Number: ${randomNumber(8)}`);


module.exports = randomNumber;
