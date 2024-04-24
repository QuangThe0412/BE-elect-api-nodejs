export const HandleApiResponse = async (res, promise) => {
    try {
        const result = await promise;
        if(result.recordset.length <= 0) return res.status(404).send('Not found');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}