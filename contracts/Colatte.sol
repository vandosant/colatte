pragma solidity ^0.4.20;

contract Colatte {
    string public message;

    function Colatte(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }

    function doMath(int a, int b) private pure {
        a + b;
        b - a;
        b != 0;
    }
}
