Framework7.prototype.plugins.angular = function (app, params) {
	function compile(newPage) {
		try {
			var $page = Dom7(newPage);
			var injector = angular.element(document).injector();
			if (injector && $page ) {
				var $compile = injector.invoke(function ($compile) { return $compile; });
				var $timeout = injector.invoke(function ($timeout) { return $timeout; });
				var $scope = injector.invoke(function ($rootScope) { return $rootScope; });
				$scope = $scope.$$childHead;
				$timeout(function () {
					$compile($page)($scope);
				});
			}
		} catch (e) {
			console.error("Some Error Occured While Compiling The Template", e);
		}
	}

	return {
		hooks: {
			pageInit: function (pageData) {
				compile(pageData.container);
			},
			navbarInit: function(navbar, pageData) {
				compile(navbar.container);
			},
			pageAfterAnimation: function (pageData) {
				//removeOldPage(pageData);
			}
		}
	}
};
