import Address from "../models/Address.js";


export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { address } = req.body;
    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { address } = req.body;

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: id, userId },
      { ...address },
      { new: true }
    );

    if (!updatedAddress) {
      return res.json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Address updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const deletedAddress = await Address.findOneAndDelete({ _id: id, userId });

    if (!deletedAddress) {
      return res.json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
