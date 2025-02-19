import SequenceNumber from '../models/sequenceNumber.js';

// Get current sequence value
const getNextSequenceValue = async () => {
  let sequence = await SequenceNumber.findOne();
  if (!sequence) {
    // If no sequence number exists, create the first record starting at 0
    sequence = await SequenceNumber.create({ sequenceValue: 0 });
  }
  return sequence.sequenceValue;
};

// Increment the sequence value
const incrementSequenceValue = async () => {
  const sequence = await SequenceNumber.findOne();
  if (sequence) {
    sequence.sequenceValue += 1;
    await sequence.save();
  }
};

// Usage
const newSequence = await getNextSequenceValue();  // Get the current value
console.log(newSequence);  // Current sequence value

await incrementSequenceValue();  // Increment the sequence