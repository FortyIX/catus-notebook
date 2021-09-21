module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions:{
                productName:'Catus Notebook',
                appId: 'com.juizeff.catus-noteook',
                win: {
                  icon: 'public/icon/logo256.ico'
                },
                linux:{
                  icon: 'public/icon/logo267.ico'  
                },
                nsis:{
                    "oneClick":false,
                    "allowToChangeInstallationDirectory": true
                },
                files:[
                    "**/*", 
                ],
                extraResources:[
                    "stage/*",
                    "documents/*",
                ],
                extraFiles:[
                    {
                        "from": "./license/",
                        "to": "resources/license",
                        "filter":[
                            "**/*"
                        ]
                    },
                ]

                
            }
        }
    }
    //...
}