import app from '../src/app.js';

export default (req, res) => {
    app.handle(req, res);
};