var f7,
	app = angular.module("StarkAdmin", [])
	/* Filters */
	.filter('range', function() {
		return function(input, total) {
			total = parseInt(total);
			for (var i=0; i<total; i++) {
				input.push(i);
			}
			return input;
		};
	})
	.filter('nl2br', ['$sce', function ($sce) {
		return function (text) {
			return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
		};
	}])
	.filter("render", function($sce) {
		return function(text) {
			//return text.join("<span class=\"spacer\"></span>");
			return $sce.trustAsHtml(text.replace(/(\_|\{.[0-9]*\})/g, "<span class=\"spacer\"></span>"));
		}
	})
	/* Controllers */
	.controller("MainViewController", function($scope, $rootScope, $compile, $http) {
		$scope.date = new Date();
		$rootScope.alertTimeout = 500;
		
		$http.get("load.php?q=decks").then(function(response) {
			$rootScope.decks = response.data;/*.sort(function(a, b) {
				return (new Date(b["created_at"])).getTime() - (new Date(a["created_at"])).getTime();
			});*/
		});
		$http.get("load.php?q=calls").then(function(response) {
			$rootScope.calls = response.data
			/*$rootScope.calls = response.data.sort(function(a, b) {
				return (new Date(b["created_at"])).getTime() - (new Date(a["created_at"])).getTime();
			});*/
		});
		$http.get("load.php?q=responses").then(function(response) {
			$rootScope.responses = response.data;
		});
		
		$scope.about = function() {
			f7.alert("Version 1.0<br>Created by: Sniper_GER<br><br>&copy; 2018 FESTIVAL Development<br>All Rights reserved","Bullshit Editor");
		}
		
		/*var splitView = false;
		var checkSplitView = function() {
			if (window.innerWidth < 768) {
				delete $rootScope.leftView.params.linksView;
				
				if (splitView) {
					if ($rootScope.mainView.history.length > 0) {
						$rootScope.leftView.router.load({
							url: $rootScope.mainView.history[$rootScope.mainView.history.length-1],
							animatePages: false
						})
					}
				}
				
				splitView = false;
			} else {
				$rootScope.leftView.params.linksView = ".view-main";
				
				if ($rootScope.leftView.history.length === 2) {
					$rootScope.mainView.router.load({
                        url: $rootScope.leftView.history[$rootScope.leftView.history.length-1],
						animatePages: false
                    });
                    $rootScope.leftView.router.back({
                        animatePages: false
                    });
                }
				
				splitView = true;
			}
		}
		
		window.addEventListener("resize", checkSplitView);
		checkSplitView();*/
		
		//if (window.innerWidth >= 768) {
			$rootScope.leftView.params.linksView = ".view-main";
			$rootScope.mainView.router.load({
                pageName: "placeholder",
				animatePages: false
            });
		//}
		
		/*Dom7(document).on('pageBeforeAnimation', function(e) {
			if (e.detail.page.name != 'index') {
				$compile(e.target)($scope);
				$scope.$apply();
			}
			$rootScope.$broadcast(e.detail.page.name + 'PageEnter', e);
		});*/
	})
	.controller("CategoriesController", function($scope, $rootScope, $http, $timeout) {
		$scope.addDeck = function() {
			if ($rootScope.editingDeck) {
				$scope.saveDeck();
			}

			$rootScope.editingDeck = null;
			$rootScope.isAddingDeck = true;
		};

		$scope.editDeck = function(deck) {
			$rootScope.editingDeck = angular.copy(deck);
			$rootScope.isAddingDeck = true;
		};

		$scope.cancelEdit = function() {
			$rootScope.isAddingDeck = false;
			$rootScope.editingDeck = null;
		}
		
		$scope.saveDeck = function() {
			if (!$rootScope.editingDeck.name) {
				return;
			}

			if ($rootScope.editingDeck.id) {
				$rootScope.editingDeck.updatedOn = parseInt((new Date()).getTime());
				$http.post("save.php?c=decks&q=update", $rootScope.editingDeck).then(function (response) {
					$rootScope.isAddingDeck = false;
					$rootScope.editingDeck = null;
					$rootScope.decks = response.data;
				});
			} else {
				$rootScope.editingDeck.createdOn = parseInt((new Date()).getTime());
				$rootScope.editingDeck.updatedOn = parseInt((new Date()).getTime());
				$http.post("save.php?c=decks&q=add", $rootScope.editingDeck).then(function (response) {
					$rootScope.isAddingDeck = false;
					$rootScope.editingDeck = null;
					$rootScope.decks = response.data;
				});
			}
			/*$http.post("save.php", $scope.deck).then(function(response) {
				$rootScope.isAddingDeck = false;
				console.log(response.data);
			});*/
		};
	})
	.controller("BlackCardsController", function($scope, $rootScope, $timeout, $http) {
		$scope.addCall = function() {
			$rootScope.editingCard = {
				text: "",
				deckId: "0"
			};
			$rootScope.isAddingCall = true;
			f7.popup("#card-edit-popup");

			$timeout(function () {
				document.querySelector(".edit-view .page-content").scrollTop = 0;
				f7.initSmartSelects(".edit-view .page");
			})
		}

		$scope.editCall = function(call) {
			$rootScope.editingCard = angular.copy(call);
			$rootScope.isAddingCall = true;
			f7.popup("#card-edit-popup");

			$timeout(function () {
				document.querySelector(".edit-view .page-content").scrollTop = 0;
				f7.initSmartSelects(".edit-view .page");
			})
		}

		$scope.deleteCall = function(call) {
			f7.modal({
				title: "Delete Call?",
				text: "Are you sure you want to delete this call? This action cannot be undone.",
				verticalButtons: true,
				buttons: [{
					text: "<span class=\"color-red\">Delete</span>",
					onClick: function() {
						$http.get("save.php?c=calls&q=delete&i="+call.id).then(function(response) {
							$rootScope.calls = response.data;
						});
					}
				}, {
					bold: true,
					text: "Cancel"
				}]
			});
		} 
	})
	.controller("WhiteCardsController", function ($scope, $rootScope, $timeout, $http) {
		$scope.addResponse = function () {
			$rootScope.editingCard = {
				text: "",
				deckId: "0"
			};
			$rootScope.isAddingResponse = true;
			f7.popup("#card-edit-popup");

			$timeout(function () {
				document.querySelector(".edit-view .page-content").scrollTop = 0;
				f7.initSmartSelects(".edit-view .page");
			})
		}

		$scope.editResponse = function (response) {
			$rootScope.editingCard = angular.copy(response);
			$rootScope.isAddingResponse = true;
			f7.popup("#card-edit-popup");

			$timeout(function () {
				document.querySelector(".edit-view .page-content").scrollTop = 0;
				f7.initSmartSelects(".edit-view .page");
			})
		}

		$scope.deleteResponse = function (response) {
			f7.modal({
				title: "Delete Response?",
				text: "Are you sure you want to delete this response? This action cannot be undone.",
				verticalButtons: true,
				buttons: [{
					text: "<span class=\"color-red\">Delete</span>",
					onClick: function () {
						$http.get("save.php?c=responses&q=delete&i=" + response.id).then(function (httpResponse) {
							$rootScope.responses = httpResponse.data;
						});
					}
				}, {
					bold: true,
					text: "Cancel"
				}]
			});
		}
	})
	.controller("EditViewController", function($scope, $rootScope, $timeout, $http) {
		setTimeout(function () {
			$rootScope.editView = f7.addView(".edit-view", {
				dynamicNavbar: true,
				domCache: true
			});
		}, 0);

		$scope.closePopup = function () {
			f7.closeModal("#card-edit-popup");
			$rootScope.isAddingCall = false;
			$rootScope.isAddingResponse = false;
		}

		var isSavingCard = false;
		$scope.saveCard = function () {
			if (isSavingCard) {
				return;
			}

			isSavingCard = true;

			if ($rootScope.editingCard.id) {
				var url = ($rootScope.isAddingCall ? "save.php?c=calls&q=update" : ($rootScope.isAddingResponse ? "save.php?c=responses&q=update" : ""));
				$rootScope.editingCard.updatedOn = parseInt((new Date()).getTime());
				$http.post(url, $rootScope.editingCard).then(function (response) {
					if ($rootScope.isAddingCall) {
						$rootScope.calls = response.data;
					} else if ($rootScope.isAddingResponse) {
						$rootScope.responses = response.data;
					}

					isSavingCard = false;
					$scope.cardEditorForm.$setPristine();
					f7.closeModal();
				});
			} else {
				var url = ($rootScope.isAddingCall ? "save.php?c=calls&q=add" : ($rootScope.isAddingResponse ? "save.php?c=responses&q=add" : ""));
				$rootScope.editingCard.createdOn = parseInt((new Date()).getTime());
				$rootScope.editingCard.updatedOn = parseInt((new Date()).getTime());
				$http.post(url, $rootScope.editingCard).then(function (response) {
					if ($rootScope.isAddingCall) {
						$rootScope.calls = response.data;
					} else if ($rootScope.isAddingResponse) {
						$rootScope.responses = response.data;
					}
					
					isSavingCard = false;
					$scope.cardEditorForm.$setPristine();
					f7.closeModal();
				});
			}
		}
	})
	/* Run Callback */
	.run(function($rootScope) {
		f7 = new Framework7({
			angular: true,
			cache: false,
			popupCloseByOutside: false
		});
		$rootScope.f7 = f7;
		
		$rootScope.leftView = f7.addView(".view-left", {
			domCache: true,
			dynamicNavbar: true,
		});
		
		$rootScope.mainView = f7.addView(".view-main", {
			dynamicNavbar: true,
			animatePages: false,
	        swipeBackPage: false,
	        reloadPages: true,
	        preloadPreviousPage: false
		});
	})