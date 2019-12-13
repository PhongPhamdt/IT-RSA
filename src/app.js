//Function to replace a char of a string
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

//Initializing the controller
var app = angular.module('app',[]);
app.controller('MainController', MainController);
MainController.$inject = ['$scope'];

//Main Controller
function MainController($scope) {
    $scope.generateKeys = function() {
        var keys = RSA_generateKeys(16);
        
        $scope.n = keys.n.toString();
        $scope.e = keys.e.toString();
        $scope.d = keys.d.toString();
        
        $scope.$watch('to_encrypt', function(to_encrypt) {
            if (!to_encrypt) return;
            
            $scope.encrypted = '';
            // for (var i = 0; i < to_encrypt.length; i++)
                $scope.encrypted += RSA_encrypt(to_encrypt, $scope.e, $scope.n);
        }, true);
        
        $scope.$watch('to_decrypt', function(to_decrypt) {
            if (!to_decrypt) return;
            
            $scope.decrypted = RSA_decrypt(to_decrypt, $scope.d, $scope.n);
        }, true);       
    }
}