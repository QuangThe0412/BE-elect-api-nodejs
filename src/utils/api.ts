// export const HandleApiResponse = async (res, promise) => {
//     try {
//         const result = await promise;
//         console.log(result)
//         if(result && result.recordset && result.recordset.length <= 0) return res.status(404).send('Not found');
//         res.json(result.recordset);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server error');
//     }
// }