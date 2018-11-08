var UtilsFB = cc.Class({
    extends: cc.Component,

    statics: {
        leaderboardMapLocal: {},

        init: function(leaderboardName) {
            UtilsFB.getLeaderboardAsync(leaderboardName).catch(error => {});
        },

        invitePlayerRandomAsync: function(imageBase64) {
            return new Promise(function(resolve, reject) {
                if (typeof FBInstant === 'undefined') {
                    reject("FBInstant undefined");
                    return;
                }

                FBInstant.player.getConnectedPlayersAsync()
                .then(function(players) {
                    if (players.length) {
                        let randomIndex = Math.floor((Math.random() * players.length));
                        let playerID = players[randomIndex].getID();
                        UtilsFB.invitePlayerAsync(playerID, imageBase64)
                        .then(function() {
                            resolve();
                        })
                        .catch(function(error) {
                            reject(error);
                        });
                    } else {
                        UtilsFB.debugLog("getConnectedPlayersAsync error: player count 0.")
                        reject("Player count is 0.");
                    }
                })
                .catch(function(error) {
                    UtilsFB.debugLog("getConnectedPlayersAsync error: " + JSON.stringify(error));
                    reject(error);
                });
            });
        },

        invitePlayerAsync: function(playerID, imageBase64) {
            return new Promise(function(resolve, reject) {
                if (typeof FBInstant === 'undefined') {
                    reject("FBInstant undefined");
                    return;
                }

                FBInstant.context.createAsync(playerID)
                .then(function() {
                    FBInstant.updateAsync({
                        action: 'CUSTOM',
                        cta: 'Join the Game',
                        image: imageBase64,
                        text: {
                            default: 'Play with me',
                            localizations: {

                            }
                        },
                        template: 'VILLAGE_INVASION',
                        strategy: 'IMMEDIATE',
                        notification: 'NO_PUSH',
                        data: {
                            createId:playerID
                        }
                    })
                    .then(function() {
                        // UtilsFB.debugLog("updateAsync success.");
                        resolve();
                    })
                    .catch(function(error) {
                        UtilsFB.debugLog("updateAsync error: " + JSON.stringify(error));
                        reject(error);
                    });
                })
                .catch(function(error) {
                    UtilsFB.debugLog("createAsync error: " + JSON.stringify(error));
                    reject(error);
                });
            });
        },

        getLeaderboardAsync: function(leaderboardName) {
            UtilsFB.debugLog("getLeaderboardAsync");
            return new Promise(function(resolve, reject) {
                if (typeof FBInstant === 'undefined') {
                    reject("FBInstant undefined");
                    return;
                }

                let playerArray = UtilsFB.getLeaderboardLocal(leaderboardName);
                if (playerArray != null) {
                    UtilsFB.debugLog("getLeaderboardAsync local");
                    resolve(playerArray);
                }

                FBInstant
                .getLeaderboardAsync(leaderboardName)
                .then(function(leaderboard) {
                    UtilsFB.debugLog("getLeaderboardAsync leaderboard: " + JSON.stringify(leaderboard));
                    return leaderboard.getConnectedPlayerEntriesAsync(10, 0)
                })
                .then(function(entries) {
                    UtilsFB.debugLog("getConnectedPlayerEntriesAsync entries: " + JSON.stringify(entries));
                    let playerArray = new Array();
                    let leaderboardScoreSelf = UtilsFB.getSelfLeaderboardScore();
                    for (let i = 0; i < entries.length; i++) {
                        let playerInfo = {};
                        let player = entries[i].getPlayer();
                        playerInfo.isSelf = player.getID() == FBInstant.player.getID();
                        playerInfo.id = player.getID();
                        playerInfo.playerName = player.getName();
                        playerInfo.photoUrl = player.getPhoto();
                        // 如果是自己，设置大的分数，防止分数还没保存上时，获取到的分数是旧的
                        if (playerInfo.isSelf) {
                            playerInfo.score = Math.max(leaderboardScoreSelf, entries[i].getScore());
                        } else {
                            playerInfo.score = entries[i].getScore();
                        }
                        playerInfo.rank = entries[i].getRank();
                        playerInfo.photoTexture = null;
                        playerArray.push(playerInfo);
                    }

                    UtilsFB.updateLeaderboardLocal(leaderboardName, playerArray);
                    resolve(playerArray);
                })
                .catch(function(error) {
                    UtilsFB.debugLog("getLeaderboardAsync error: " + JSON.stringify(error));
                    reject(error);
                });
            });
        },

        loadPlayerArrayPhoto: function(playerArray) {
            UtilsFB.debugLog("loadPlayerArrayPhoto");
            if (playerArray != null) {
                for (let i = 0; i < playerArray.length; i++) {
                    UtilsFB.loadPlayerPhotoAsync(playerArray[i]).catch(error => {});
                }
            }
        },

        loadPlayerPhotoAsync: function(playerInfo) {
            return new Promise(function(resolve, reject) {
                cc.loader.load({url: playerInfo.photoUrl, type: 'jpg'}, function (err, texture) {
                    if (texture != null) {
                        playerInfo.photoTexture = texture;
                        resolve();
                    } else {
                        UtilsFB.debugLog("loadPlayerPhotoAsync error: " + JSON.stringify(err));
                        reject(err);
                    }
                });
            });
       },

        setLeaderboardAsync(leaderboardName, score) {
            UtilsFB.debugLog("setLeaderboardAsync");
            return new Promise(function(resolve, reject) {
                if (typeof FBInstant == 'undefined') {
                    reject("FBInstant undefined");
                    return;
                }

                if (UtilsFB.setLeaderboardLocal(leaderboardName, score)) {
                    resolve();
                }

                FBInstant
                .getLeaderboardAsync(leaderboardName)
                .then(leaderboard => {
                    return leaderboard.setScoreAsync(score);
                })
                .then(function() {
                    resolve();
                })
                .catch(function(error) {
                    UtilsFB.debugLog("setLeaderboardAsync error: " + JSON.stringify(error));
                    reject(error);
                });
            });
        },

        getPlayerPhotoAsync(playerInfo) {
            return new Promise(function(resolve, reject) {
                if (playerInfo.photoTexture != null) {
                    resolve();
                } else {
                    UtilsFB.loadPlayerPhotoAsync(playerInfo)
                    .then(function() {
                        resolve();
                    })
                    .catch(function(error) {
                        UtilsFB.debugLog("getPlayerPhotoAsync error: " + JSON.stringify(error));
                        reject(error);
                    });
                }
            });
        },

        getLeaderboardLocal(leaderboardName) {
            if (leaderboardName in UtilsFB.leaderboardMapLocal) {
                return UtilsFB.leaderboardMapLocal[leaderboardName].playerArray;
            }
            return null;
        },

        updateLeaderboardLocal(leaderboardName, playerArray) {
            UtilsFB.debugLog("updateLeaderboardLocal: " + leaderboardName);
            if (!(leaderboardName in UtilsFB.leaderboardMapLocal)) {
                UtilsFB.leaderboardMapLocal[leaderboardName] = {};

            }
            UtilsFB.leaderboardMapLocal[leaderboardName].playerArray = playerArray;
            UtilsFB.loadPlayerArrayPhoto(UtilsFB.leaderboardMapLocal[leaderboardName].playerArray);
        },

        setLeaderboardLocal(leaderboardName, score) {
            let ret = false;
            if (leaderboardName in UtilsFB.leaderboardMapLocal) {
                let playerArrayLocal = UtilsFB.leaderboardMapLocal[leaderboardName].playerArray;
                let scoreUpdated = false;
                if (playerArrayLocal != null) {
                    for (let i = 0; i < playerArrayLocal.length; i++) {
                        let playerInfo = playerArrayLocal[i];
                        if (playerInfo.isSelf) {
                            if (score > playerInfo.score) {
                                playerInfo.score = score;
                                scoreUpdated = true;
                            }
                            ret = true;
                        }
                    }
                }

                if (scoreUpdated) {
                    let compare = function(play1, play2) {
                        let score1 = play1.score;
                        let score2 = play2.score;
                        if (score1 < score2) {
                            return 1;
                        } else if (score1 > score2) {
                            return -1;
                        } else {
                            return 0;
                        }
                    };

                    playerArrayLocal.sort(compare);

                    for (let i = 0; i < playerArrayLocal.length; i++) {
                        playerArrayLocal[i].rank = i + 1;
                    }
                }
            }

            return ret;
        },

        getPlayerInfoScoreOvertake(leaderboardName, scoreBefore, scoreCurrent) {
            let playerOvertaken = [];
            let playerArray = UtilsFB.getLeaderboardLocal(leaderboardName);
            if (playerArray != null) {
                for (let i = 0; i < playerArray.length; i++) {
                    let playerInfo = playerArray[i];
                    let score = playerInfo.score;
                    if (scoreBefore <= score && score < scoreCurrent) {
                        playerOvertaken.push(playerInfo);
                    }
                }
            }

            return playerOvertaken;
        },

        getSelfLeaderboardScore(leaderboardName) {
            let playerArray = UtilsFB.getLeaderboardLocal(leaderboardName);
            if (playerArray != null) {
                for (let i = 0; i < playerArray.length; i++) {
                    let playerInfo = playerArray[i];
                    if (playerInfo.isSelf) {
                        return playerInfo.score;
                    }
                }
            }

            return -1;
        },

        shareAsync: function(message, imageBase64) {
            return new Promise(function(resolve, reject) {
                if (typeof FBInstant == 'undefined') {
                    reject("FBInstant undefined");
                    return;
                }

                FBInstant.shareAsync({
                    intent: 'SHARE',
                    image: imageBase64,
                    text: message,
                    data: {myReplayData: '...' },
                }).then(function() {
                    resolve();
                })
                .catch(function(error) {
                    UtilsFB.debugLog("shareAsync error: " + JSON.stringify(error));
                    reject(error);
                });
            });
        },

        chooseAsync: function(imageBase64, filters) {
            return new Promise(function(resolve, reject) {
                if (typeof FBInstant == 'undefined') {
                    reject("FBInstant undefined");
                    return;
                }

                filters = filters || [];

                FBInstant.context.chooseAsync({
                    filters: filters,
                }).then(function() {
                    FBInstant.updateAsync({
                        action: 'CUSTOM',
                        cta: 'Join the Game',
                        image: imageBase64,
                        text: {
                            default: 'Play with me',
                            localizations: {

                            }
                        },
                        template: 'VILLAGE_INVASION',
                        strategy: 'IMMEDIATE',
                        notification: 'NO_PUSH',
                        data: {
                        }
                    })
                    .then(function() {
                        UtilsFB.debugLog("chooseAsync success.");
                        resolve();
                    })
                    .catch(function(error) {
                        UtilsFB.debugLog("chooseAsync updateAsync error: " + JSON.stringify(error));
                        reject(error);
                    });
                })
                .catch(function(error) {
                    UtilsFB.debugLog("chooseAsync error: " + JSON.stringify(error));
                    reject(error);
                });
            });
        },

        debugLog: function(message) {
            // console.log("[fb]" + message);
        },
    },
});
