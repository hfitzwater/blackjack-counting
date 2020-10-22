let publicPath = '/';

if( process.env.FOR_DOCKER !== 'true' && process.env.NODE_ENV === 'production' ) {
  publicPath = '/blackjack-counting/';
}

module.exports = { publicPath };