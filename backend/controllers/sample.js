exports.getSample = (req, res, next) => {
    res.status(200).json({ message: 'Hello World!' });
}

exports.getSampleById = (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({ message: `Hello World! ${id}` });
}

exports.postSample = (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    
    if (!body.name) return res.status(400).json({ message: 'Name body param is required' });
    res.status(200).json({ message: `Hello World! ${id}`, body });
}