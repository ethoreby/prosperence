'use strict';

describe('Controller: DebtsCtrl', function () {

  // load the controller's module
  beforeEach(module('prosperenceApp'));

  var DebtsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DebtsCtrl = $controller('DebtsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
