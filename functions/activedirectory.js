var ActiveDirectory = require('activedirectory2');
var config = { url: 'ldap://dc.domain.com',
               baseDN: 'dc=ITC,dc=com',
               username: 'username@domain.com',
               password: 'password' }
var ad = new ActiveDirectory(config);