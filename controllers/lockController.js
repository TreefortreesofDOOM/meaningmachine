const { getArtLockStatus } = require('../routes/lockservice');

exports.lockStatus = async (req, res) => {
    try {
        const lockStatus = await getArtLockStatus();
        res.json(lockStatus);
        console.log(lockStatus);
    } catch (error) {
        console.error('Error checking status:', error.message);
        res.status(500).json({ error: error.message });
    }
};
