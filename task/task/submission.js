const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const axios = require('axios');
const sha256 = require('sha256'); 
let server_url = 'http://ec2-34-207-236-225.compute-1.amazonaws.com/';

class Submission {
  /**
   * Executes your task, optionally storing the result.
   *
   * @param {number} round - The current round number
   * @returns {void}
   */
  async task(round) {
    let pubkey = await namespaceWrapper.getMainAccountPubkey();
    let request_url = server_url + 'download/' + pubkey;
    console.log('request_url', request_url);
    try {
        const response = await axios.get(request_url);
        let hash = sha256(response.data.toString(), { asString: true });
        let base64Hash = Buffer.from(hash).toString('base64'); 
        // NOTE: This hash is the 'submission' to K2
        console.log('hash', hash.length);
        await namespaceWrapper.storeSet('value', base64Hash);
    } catch (err) {
        console.log('error in pushOne for ' + pubkey + ': ' + err);
    }


}

  /**
   * Submits a task for a given round
   *
   * @param {number} round - The current round number
   * @returns {Promise<any>} The submission value that you will use in audit. Ex. cid of the IPFS file
   */
  async submitTask(round) {
    console.log('SUBMIT TASK CALLED ROUND NUMBER', round);
    try {
      console.log('SUBMIT TASK SLOT', await namespaceWrapper.getSlot());
      const submission = await this.fetchSubmission(round);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(submission, round);
      console.log('SUBMISSION CHECKED AND ROUND UPDATED');
      return submission;
    } catch (error) {
      console.log('ERROR IN SUBMISSION', error);
    }
  }
  /**
   * Fetches the submission value
   *
   * @param {number} round - The current round number
   * @returns {Promise<string>} The submission value that you will use in audit. It can be the real value, cid, etc.
   *
   */
  async fetchSubmission(round) {
    console.log('FETCH SUBMISSION');
    console.log('Started Submission', new Date(), process.env.TEST_KEYWORD)
    // Fetch the value from NeDB
    const value = await namespaceWrapper.storeGet('value'); // retrieves the value
    // Return cid/value, etc.
    return value;
  }
}
const submission = new Submission();
module.exports = { submission };
