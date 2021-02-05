declare const storageAccessHelper = "(function() {\n      var ACCESS_GRANTED_STATUS = 'storage_access_granted';\n      var ACCESS_DENIED_STATUS = 'storage_access_denied';\n\n      function StorageAccessHelper(redirectData) {\n        this.redirectData = redirectData;\n      }\n\n      StorageAccessHelper.prototype.setNormalizedLink = function(storageAccessStatus) {\n        return storageAccessStatus === ACCESS_GRANTED_STATUS ? this.redirectData.hasStorageAccessUrl : this.redirectData.doesNotHaveStorageAccessUrl;\n      }\n\n      StorageAccessHelper.prototype.redirectToAppTLD = function(storageAccessStatus) {\n        var normalizedLink = document.createElement('a');\n\n        normalizedLink.href = this.setNormalizedLink(storageAccessStatus);\n\n        data = JSON.stringify({\n          message: 'Shopify.API.remoteRedirect',\n          data: {\n            location: normalizedLink.href,\n          }\n        });\n        window.parent.postMessage(data, this.redirectData.myshopifyUrl);\n      }\n\n      StorageAccessHelper.prototype.redirectToAppsIndex = function() {\n        window.parent.location.href = this.redirectData.myshopifyUrl + '/admin/apps';\n      }\n\n      StorageAccessHelper.prototype.redirectToAppTargetUrl = function() {\n        window.location.href = this.redirectData.appTargetUrl;\n      }\n\n      StorageAccessHelper.prototype.sameSiteNoneIncompatible = function(ua) {\n        return ua.includes(\"iPhone OS 12_\") || ua.includes(\"iPad; CPU OS 12_\") || //iOS 12\n        (ua.includes(\"UCBrowser/\")\n            ? this.isOlderUcBrowser(ua) //UC Browser < 12.13.2\n            : (ua.includes(\"Chrome/5\") || ua.includes(\"Chrome/6\"))) ||\n        ua.includes(\"Chromium/5\") || ua.includes(\"Chromium/6\") ||\n        (ua.includes(\" OS X 10_14_\") &&\n            ((ua.includes(\"Version/\") && ua.includes(\"Safari\")) || //Safari on MacOS 10.14\n            ua.endsWith(\"(KHTML, like Gecko)\"))); //Web view on MacOS 10.14\n      }\n\n      StorageAccessHelper.prototype.isOlderUcBrowser = function(ua) {\n        var match = ua.match(/UCBrowser\\/(\\d+)\\.(\\d+)\\.(\\d+)\\./);\n        if (!match) return false;\n        var major = parseInt(match[1]);\n        var minor = parseInt(match[2]);\n        var build = parseInt(match[3]);\n        if (major != 12) return major < 12;\n        if (minor != 13) return minor < 13;\n        return build < 2;\n      }\n\n      StorageAccessHelper.prototype.setCookie = function(value) {\n        if(!this.sameSiteNoneIncompatible(navigator.userAgent)) {\n          value += '; secure; SameSite=None'\n        }\n        document.cookie = value;\n      }\n\n      StorageAccessHelper.prototype.grantedStorageAccess = function() {\n        try {\n          sessionStorage.setItem('shopify.granted_storage_access', true);\n          this.setCookie('shopify.granted_storage_access=true');\n          if (!document.cookie) {\n            throw 'Cannot set third-party cookie.'\n          }\n          this.redirectToAppTargetUrl();\n        } catch (error) {\n          console.warn('Third party cookies may be blocked.', error);\n          this.redirectToAppTLD(ACCESS_DENIED_STATUS);\n        }\n      }\n\n      StorageAccessHelper.prototype.handleRequestStorageAccess = function() {\n        return document.requestStorageAccess().then(this.grantedStorageAccess.bind(this), this.redirectToAppsIndex.bind(this, ACCESS_DENIED_STATUS));\n      }\n\n      StorageAccessHelper.prototype.setupRequestStorageAccess = function() {\n        var requestContent = document.getElementById('RequestStorageAccess');\n        var requestButton = document.getElementById('TriggerAllowCookiesPrompt');\n\n        requestButton.addEventListener('click', this.handleRequestStorageAccess.bind(this));\n        requestContent.style.display = 'block';\n      }\n\n      StorageAccessHelper.prototype.handleHasStorageAccess = function() {\n        if (sessionStorage.getItem('shopify.granted_storage_access')) {\n          // If app was classified by ITP and used Storage Access API to acquire access\n          this.redirectToAppTargetUrl();\n        } else {\n          // If app has not been classified by ITP and still has storage access\n          this.redirectToAppTLD(ACCESS_GRANTED_STATUS);\n        }\n      }\n\n      StorageAccessHelper.prototype.handleGetStorageAccess = function() {\n        if (sessionStorage.getItem('shopify.top_level_interaction')) {\n          // If merchant has been redirected to interact with TLD (requirement for prompting request to gain storage access)\n          this.setupRequestStorageAccess();\n        } else {\n          // If merchant has not been redirected to interact with TLD (requirement for prompting request to gain storage access)\n          this.redirectToAppTLD(ACCESS_DENIED_STATUS);\n        }\n      }\n\n      StorageAccessHelper.prototype.manageStorageAccess = function() {\n        return document.hasStorageAccess().then(function(hasAccess) {\n          if (hasAccess) {\n            this.handleHasStorageAccess();\n          } else {\n            this.handleGetStorageAccess();\n          }\n        }.bind(this));\n      }\n\n      StorageAccessHelper.prototype.execute = function() {\n        if (ITPHelper.prototype.userAgentIsAffected()) {\n          this.manageStorageAccess();\n        } else {\n          this.grantedStorageAccess();\n        }\n      }\n\n      /* ITP 2.0 solution: handles cookie partitioning */\n      StorageAccessHelper.prototype.setUpHelper = function() {\n        return new ITPHelper({redirectUrl: window.shopOrigin + \"/admin/apps/\" + window.apiKey + window.returnTo});\n      }\n\n      StorageAccessHelper.prototype.setCookieAndRedirect = function() {\n        this.setCookie('shopify.cookies_persist=true');\n        var helper = this.setUpHelper();\n        helper.redirect();\n      }\n\n      StorageAccessHelper.prototype.setUpCookiePartitioning = function() {\n        var itpContent = document.getElementById('CookiePartitionPrompt');\n        itpContent.style.display = 'block';\n\n        // var button = document.getElementById('AcceptCookies');\n        // button.addEventListener('click', this.setCookieAndRedirect.bind(this));\n      }\n\n      this.StorageAccessHelper = StorageAccessHelper;\n    })(window);";
export default storageAccessHelper;
//# sourceMappingURL=storage-access-helper.d.ts.map