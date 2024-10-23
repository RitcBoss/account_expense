require('dotenv').config();
const express = require('express');
const router = express.Router();
const ejs = require('ejs')
const app = express();
const path = require('path');

const flash = require('connect-flash');
const session = require('express-session');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const authenticateToken = require('./middleware/authenticateToken')
const jwtSecret = crypto.randomBytes(32).toString('hex');
const sessionSecret = crypto.randomBytes(32).toString('hex');


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());
app.use(authenticateToken);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const indexController = require('./controllers/indexController')
const registerController = require('./controllers/registerController')
const loginUserController = require('./controllers/loginUserController')
const authController = require('./controllers/authController')
const accountController = require('./controllers/accountController')
const mainController = require('./controllers/mainController')
const transactionController = require('./controllers/transactionController');
const summaryController = require('./controllers/summaryController');
const redirectifAuth = require('./middleware/redirectifAuth');
const { ensureAuthenticated } = require('./middleware/ensureAuthenticated')


app.get('/', indexController)
app.get('/account', ensureAuthenticated, mainController)
app.get('/register', redirectifAuth, registerController)
app.get('/login', redirectifAuth, loginUserController)
app.get('/account/transactions/:accountId', transactionController.getTransactions)
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});
app.get('/summary',ensureAuthenticated,summaryController.getTransactions)


app.post('/user/register', redirectifAuth, authController.register)
app.post('/user/login', redirectifAuth, authController.login)
app.post('/account/add', ensureAuthenticated,accountController.addAccount);
app.post('/account/delete/:id', ensureAuthenticated,accountController.deleteAccount);
app.post('/add-transaction', ensureAuthenticated, transactionController.upload.single('slip'),transactionController.addTransaction);
app.post('/delete-transaction/:account_id/:id', ensureAuthenticated,transactionController.deleteTransaction);



app.listen(4000, () => {
    console.log('Server is running...')
})

