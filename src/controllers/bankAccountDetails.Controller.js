const BankAccountDetails = require('../models/bankAccountDetails.Model');

const bankAccountDetailsController = {
    addBankAccountDetails: async (req, res) => {
        try {
            const { bankName, accountHolderName, accountNumber, iban, branchCode, status } = req.body;

            if (!bankName || !accountHolderName || !accountNumber || !branchCode) {
                return res.status(400).json({ message: "Bank name, account holder name, account number, and branch code are required" });
            }

            const newBankAccount = await BankAccountDetails.create({
                bankName,
                accountHolderName,
                accountNumber,
                iban,
                branchCode,
                status: status !== undefined ? status : true,
            });

            res.status(201).json({ message: "Bank account details added successfully", data: newBankAccount });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getBankAccountDetails: async (req, res) => {
        try {
            const bankAccountDetails = await BankAccountDetails.findAll();
            res.status(200).json(bankAccountDetails);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getBankAccountDetailsById: async (req, res) => {
        try {
            const { id } = req.params;
            const bankAccount = await BankAccountDetails.findOne({ where: { id } });

            if (!bankAccount) {
                return res.status(404).json({ message: "Bank account details not found" });
            }

            res.status(200).json(bankAccount);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateBankAccountDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const { bankName, accountHolderName, accountNumber, iban, branchCode, status } = req.body;

            const bankAccount = await BankAccountDetails.findOne({ where: { id } });

            if (!bankAccount) {
                return res.status(404).json({ message: "Bank account details not found" });
            }

            bankAccount.bankName = bankName || bankAccount.bankName;
            bankAccount.accountHolderName = accountHolderName || bankAccount.accountHolderName;
            bankAccount.accountNumber = accountNumber || bankAccount.accountNumber;
            bankAccount.iban = iban || bankAccount.iban;
            bankAccount.branchCode = branchCode || bankAccount.branchCode;
            bankAccount.status = status !== undefined ? status : bankAccount.status;

            await bankAccount.save();

            res.status(200).json({ message: "Bank account details updated successfully", data: bankAccount });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteBankAccountDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const bankAccount = await BankAccountDetails.findOne({ where: { id } });

            if (!bankAccount) {
                return res.status(404).json({ message: "Bank account details not found" });
            }

            await bankAccount.destroy();

            res.status(200).json({ message: "Bank account details deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = bankAccountDetailsController;
