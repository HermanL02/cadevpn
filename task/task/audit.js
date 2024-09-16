const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const axios = require('axios');
let server_url = 'http://ec2-34-207-236-225.compute-1.amazonaws.com/';

class Audit {
  /**
   * Validates the submission value by your logic
   *
   * @param {string} submission_value - The submission value to be validated
   * @param {number} round - The current round number
   * @param {number} submitter_pubkey - The submitter pubkey **TODO NEW**
   * @returns {Promise<boolean>} The validation result, return true if the submission is correct, false otherwise
   */
  async validateNode(submission_value, round, submitter_pubkey) {
    let isValid = false; 
    let query = server_url + 'downloads/' + encodeURIComponent(submission_value);
  
    try {
      const result = await axios.get(query); 
      let pubkey = result.data;
      if (pubkey) {
        isValid = (pubkey === submitter_pubkey);
      } else {
        console.log('no reply for downloads');
      }
    } catch (e) {
      console.error(e);
    }
    return isValid;
  }
  /**
   * Audits the submission value by your logic
   *
   * @param {number} roundNumber - The current round number
   * @returns {void}
   */
  async auditTask(roundNumber) {
    console.log('AUDIT CALLED IN ROUND', roundNumber);
    console.log('CURRENT SLOT IN AUDIT', await namespaceWrapper.getSlot());
    await namespaceWrapper.validateAndVoteOnNodes(this.validateNode, roundNumber, false, false);
  }
}
const audit = new Audit();
module.exports = { audit };
