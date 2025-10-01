import { TherapistData } from "@/types";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { TherapistData } from "./TherapistDashboard";
// Bank Details interface
interface BankDetails {
    id?: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
    isDefault: boolean;
}

// Payout Request interface
interface PayoutRequest {
    id: string;
    amount: number;
    requestDate: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    bankDetails: BankDetails;
    estimatedArrival?: string;
}

interface EarningProps {
    isEarningsModalVisible: boolean
    setIsEarningsModalVisible: Dispatch<SetStateAction<boolean>>
    activeEarningsTab: 'overview' | 'banking' | 'payout'
    setActiveEarningsTab: Dispatch<SetStateAction<'overview' | 'banking' | 'payout'>>
    therapistData: TherapistData | undefined
}
const EarningModal: React.FC<EarningProps> = ({ isEarningsModalVisible, setIsEarningsModalVisible, activeEarningsTab, setActiveEarningsTab, therapistData }) => {
    // Bank details state
    const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
    const [newBankDetails, setNewBankDetails] = useState<BankDetails>({
        bankName: '',
        accountName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking',
        isDefault: false,
    });

    // Payout state
    const [payoutAmount, setPayoutAmount] = useState<string>('');
    const [selectedBankForPayout, setSelectedBankForPayout] = useState<string>('');
    const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
    // Add bank account
    const addBankAccount = () => {
        if (!newBankDetails.bankName.trim() || !newBankDetails.accountName.trim() ||
            !newBankDetails.accountNumber.trim() || !newBankDetails.routingNumber.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const bankAccount: BankDetails = {
            id: Date.now().toString(),
            ...newBankDetails,
            isDefault: bankDetails.length === 0 || newBankDetails.isDefault,
        };

        // If this is set as default, update other accounts
        const updatedBankDetails = bankDetails.map(bank => ({
            ...bank,
            isDefault: newBankDetails.isDefault ? false : bank.isDefault
        }));

        setBankDetails([...updatedBankDetails, bankAccount]);
        setNewBankDetails({
            bankName: '',
            accountName: '',
            accountNumber: '',
            routingNumber: '',
            accountType: 'checking',
            isDefault: false,
        });

        Alert.alert('Success', 'Bank account added successfully');
    };

    // Request payout
    const requestPayout = () => {
        const amount = parseFloat(payoutAmount);
        const availableBalance = therapistData?.result[0]?.balance || 0;

        if (!amount || amount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (amount > availableBalance) {
            Alert.alert('Error', `Insufficient balance. Available: $${availableBalance.toFixed(2)}`);
            return;
        }

        if (!selectedBankForPayout) {
            Alert.alert('Error', 'Please select a bank account');
            return;
        }

        const selectedBank = bankDetails.find(bank => bank.id === selectedBankForPayout);
        if (!selectedBank) return;

        const newPayout: PayoutRequest = {
            id: Date.now().toString(),
            amount,
            requestDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            bankDetails: selectedBank,
            estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        };

        setPayoutRequests([newPayout, ...payoutRequests]);
        setPayoutAmount('');
        setSelectedBankForPayout('');

        Alert.alert('Success', 'Payout request submitted successfully. You will receive an email confirmation shortly.');
    };

    // Get payout status color
    const getPayoutStatusColor = (status: PayoutRequest['status']) => {
        switch (status) {
            case 'completed':
                return '#28a745';
            case 'processing':
                return '#007AFF';
            case 'pending':
                return '#ffc107';
            case 'failed':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };
    return (
        <Modal
            visible={isEarningsModalVisible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity
                        onPress={() => setIsEarningsModalVisible(false)}
                        style={styles.cancelButton}
                    >
                        <Text style={styles.cancelButtonText}>Close</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Earnings & Payouts</Text>
                    <View style={{ width: 60 }} />
                </View>

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeEarningsTab === 'overview' && styles.tabButtonActive]}
                        activeOpacity={1}
                        onPress={() => setActiveEarningsTab('overview')}
                    >
                        <Text style={[styles.tabButtonText, activeEarningsTab === 'overview' && styles.tabButtonTextActive]}>
                            Overview
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeEarningsTab === 'banking' && styles.tabButtonActive]}
                        activeOpacity={1}
                        onPress={() => setActiveEarningsTab('banking')}
                    >
                        <Text style={[styles.tabButtonText, activeEarningsTab === 'banking' && styles.tabButtonTextActive]}>
                            Banking
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeEarningsTab === 'payout' && styles.tabButtonActive]}
                        activeOpacity={1}
                        onPress={() => setActiveEarningsTab('payout')}
                    >
                        <Text style={[styles.tabButtonText, activeEarningsTab === 'payout' && styles.tabButtonTextActive]}>
                            Payout
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    {/* Overview Tab */}
                    {activeEarningsTab === 'overview' && (
                        <View>
                            {/* Earnings Summary Cards */}
                            <View style={styles.earningsGrid}>
                                <View style={[styles.earningsCard, styles.balanceCard]}>
                                    <Text style={styles.earningsCardLabel}>Available Balance</Text>
                                    <Text style={styles.earningsCardValue}>
                                        ${(therapistData?.result[0]?.balance || 0).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={[styles.earningsCard, styles.pendingCard]}>
                                    <Text style={styles.earningsCardLabel}>Pending</Text>
                                    <Text style={styles.earningsCardValue}>
                                        ${(therapistData?.result[0]?.pending || 0).toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.earningsCard}>
                                <Text style={styles.earningsCardLabel}>Total Earnings</Text>
                                <Text style={[styles.earningsCardValue, styles.totalEarnings]}>
                                    ${(therapistData?.result[0]?.total_earning || 0).toFixed(2)}
                                </Text>
                            </View>

                            {/* Recent Payouts */}
                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>Recent Payouts</Text>
                                {payoutRequests.length === 0 ? (
                                    <Text style={styles.emptyStateText}>No payout requests yet</Text>
                                ) : (
                                    payoutRequests.slice(0, 5).map(payout => (
                                        <View key={payout.id} style={styles.payoutItem}>
                                            <View style={styles.payoutItemLeft}>
                                                <Text style={styles.payoutAmount}>${payout.amount.toFixed(2)}</Text>
                                                <Text style={styles.payoutDate}>{new Date(payout.requestDate).toLocaleDateString()}</Text>
                                            </View>
                                            <View style={[
                                                styles.payoutStatusBadge,
                                                { backgroundColor: getPayoutStatusColor(payout.status) }
                                            ]}>
                                                <Text style={styles.payoutStatusText}>{payout.status}</Text>
                                            </View>
                                        </View>
                                    ))
                                )}
                            </View>
                        </View>
                    )}

                    {/* Banking Tab */}
                    {activeEarningsTab === 'banking' && (
                        <View>
                            {/* Add New Bank Account */}
                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>Add Bank Account</Text>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Bank Name *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={newBankDetails.bankName}
                                        onChangeText={(text) => setNewBankDetails(prev => ({ ...prev, bankName: text }))}
                                        placeholder="e.g., Chase Bank"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Account Holder Name *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={newBankDetails.accountName}
                                        onChangeText={(text) => setNewBankDetails(prev => ({ ...prev, accountName: text }))}
                                        placeholder="Full name as on bank account"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Account Number *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={newBankDetails.accountNumber}
                                        onChangeText={(text) => setNewBankDetails(prev => ({ ...prev, accountNumber: text }))}
                                        placeholder="Account number"
                                        keyboardType="numeric"
                                        secureTextEntry
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Routing Number *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={newBankDetails.routingNumber}
                                        onChangeText={(text) => setNewBankDetails(prev => ({ ...prev, routingNumber: text }))}
                                        placeholder="9-digit routing number"
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Account Type</Text>
                                    <View style={styles.accountTypeContainer}>
                                        <TouchableOpacity
                                            style={[
                                                styles.accountTypeButton,
                                                newBankDetails.accountType === 'checking' && styles.accountTypeButtonSelected
                                            ]}
                                            activeOpacity={1}
                                            onPress={() => setNewBankDetails(prev => ({ ...prev, accountType: 'checking' }))}
                                        >
                                            <Text style={[
                                                styles.accountTypeButtonText,
                                                newBankDetails.accountType === 'checking' && styles.accountTypeButtonTextSelected
                                            ]}>
                                                Checking
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.accountTypeButton,
                                                newBankDetails.accountType === 'savings' && styles.accountTypeButtonSelected
                                            ]}
                                            activeOpacity={1}
                                            onPress={() => setNewBankDetails(prev => ({ ...prev, accountType: 'savings' }))}
                                        >
                                            <Text style={[
                                                styles.accountTypeButtonText,
                                                newBankDetails.accountType === 'savings' && styles.accountTypeButtonTextSelected
                                            ]}>
                                                Savings
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => setNewBankDetails(prev => ({ ...prev, isDefault: !prev.isDefault }))}
                                >
                                    <View style={[
                                        styles.checkbox,
                                        newBankDetails.isDefault && styles.checkboxChecked
                                    ]}>
                                        {newBankDetails.isDefault && <Text style={styles.checkmark}>✓</Text>}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Set as default account</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.addBankButton}
                                    onPress={addBankAccount}
                                >
                                    <Text style={styles.addBankButtonText}>Add Bank Account</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Saved Bank Accounts */}
                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>Saved Accounts ({bankDetails.length})</Text>
                                {bankDetails.length === 0 ? (
                                    <Text style={styles.emptyStateText}>No bank accounts added yet</Text>
                                ) : (
                                    bankDetails.map(bank => (
                                        <View key={bank.id} style={styles.bankAccountItem}>
                                            <View style={styles.bankAccountInfo}>
                                                <Text style={styles.bankName}>{bank.bankName}</Text>
                                                <Text style={styles.bankAccountDetails}>
                                                    {bank.accountType} •••• {bank.accountNumber.slice(-4)}
                                                </Text>
                                                <Text style={styles.bankAccountName}>{bank.accountName}</Text>
                                            </View>
                                            {bank.isDefault && (
                                                <View style={styles.defaultBadge}>
                                                    <Text style={styles.defaultBadgeText}>Default</Text>
                                                </View>
                                            )}
                                        </View>
                                    ))
                                )}
                            </View>
                        </View>
                    )}

                    {/* Payout Tab */}
                    {activeEarningsTab === 'payout' && (
                        <View>
                            {/* Request Payout */}
                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>Request Payout</Text>
                                <Text style={styles.availableBalance}>
                                    Available: ${(therapistData?.result[0]?.balance || 0).toFixed(2)}
                                </Text>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Payout Amount *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={payoutAmount}
                                        onChangeText={setPayoutAmount}
                                        placeholder="0.00"
                                        keyboardType="decimal-pad"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Select Bank Account *</Text>
                                    {bankDetails.length === 0 ? (
                                        <Text style={styles.noBankAccountText}>
                                            No bank accounts available. Add one in the Banking tab.
                                        </Text>
                                    ) : (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.bankSelectionContainer}>
                                                {bankDetails.map(bank => (
                                                    <TouchableOpacity
                                                        key={bank.id}
                                                        style={[
                                                            styles.bankSelectionItem,
                                                            selectedBankForPayout === bank.id && styles.bankSelectionItemSelected
                                                        ]}
                                                        onPress={() => setSelectedBankForPayout(bank.id!)}
                                                    >
                                                        <Text style={[
                                                            styles.bankSelectionName,
                                                            selectedBankForPayout === bank.id && styles.bankSelectionNameSelected
                                                        ]}>
                                                            {bank.bankName}
                                                        </Text>
                                                        <Text style={[
                                                            styles.bankSelectionDetails,
                                                            selectedBankForPayout === bank.id && styles.bankSelectionDetailsSelected
                                                        ]}>
                                                            •••• {bank.accountNumber.slice(-4)}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.requestPayoutButton,
                                        (!payoutAmount || !selectedBankForPayout || bankDetails.length === 0) && styles.requestPayoutButtonDisabled
                                    ]}
                                    onPress={requestPayout}
                                    disabled={!payoutAmount || !selectedBankForPayout || bankDetails.length === 0}
                                >
                                    <Text style={styles.requestPayoutButtonText}>Request Payout</Text>
                                </TouchableOpacity>

                                <Text style={styles.payoutNote}>
                                    Payouts typically arrive within 1-3 business days. A confirmation email will be sent once processed.
                                </Text>
                            </View>

                            {/* Payout History */}
                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>Payout History</Text>
                                {payoutRequests.length === 0 ? (
                                    <Text style={styles.emptyStateText}>No payout requests yet</Text>
                                ) : (
                                    payoutRequests.map(payout => (
                                        <View key={payout.id} style={styles.payoutHistoryItem}>
                                            <View style={styles.payoutHistoryLeft}>
                                                <Text style={styles.payoutHistoryAmount}>${payout.amount.toFixed(2)}</Text>
                                                <Text style={styles.payoutHistoryDate}>
                                                    {new Date(payout.requestDate).toLocaleDateString()}
                                                </Text>
                                                <Text style={styles.payoutHistoryBank}>
                                                    {payout.bankDetails.bankName} •••• {payout.bankDetails.accountNumber.slice(-4)}
                                                </Text>
                                                {payout.estimatedArrival && payout.status === 'processing' && (
                                                    <Text style={styles.payoutHistoryEta}>
                                                        Est. arrival: {new Date(payout.estimatedArrival).toLocaleDateString()}
                                                    </Text>
                                                )}
                                            </View>
                                            <View style={[
                                                styles.payoutHistoryStatusBadge,
                                                { backgroundColor: getPayoutStatusColor(payout.status) }
                                            ]}>
                                                <Text style={styles.payoutHistoryStatusText}>{payout.status}</Text>
                                            </View>
                                        </View>
                                    ))
                                )}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};
const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    modalHeader: {
        // backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d4150',
    },
    cancelButton: {
        padding: 4,
    },
    cancelButtonText: {
        color: '#6b7280',
        fontSize: 16,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    // Tab Styles
    tabContainer: {
        flexDirection: 'row',
        // backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 8,
        padding: 4,
        marginTop: 16,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: '#4CAF50',
    },
    tabButtonText: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    tabButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    // Earnings Overview Styles
    earningsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    earningsCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: "#DEE2E6",
        borderWidth: 1,
        alignItems: 'center',
    },
    balanceCard: {
        flex: 0.48,
        backgroundColor: '#e8f5e8',
        borderColor: "#DEE2E6",
        borderWidth: 1,
    },
    pendingCard: {
        flex: 0.48,
        backgroundColor: '#fff3cd',
        borderColor: "#DEE2E6",
        borderWidth: 1,
    },
    earningsCardLabel: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 8,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    earningsCardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d4150',
        textAlign: 'center',
    },
    totalEarnings: {
        fontSize: 32,
        color: '#4CAF50',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: "#DEE2E6",
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 16,
    },
    emptyStateText: {
        textAlign: 'center',
        color: '#6c757d',
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 16,
    },
    // Payout Item Styles
    payoutItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    payoutItemLeft: {
        flex: 1,
    },
    payoutAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 4,
    },
    payoutDate: {
        fontSize: 12,
        color: '#6c757d',
    },
    payoutStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    payoutStatusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    // Input Styles
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    // Account Type Styles
    accountTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    accountTypeButton: {
        flex: 0.48,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
        alignItems: 'center',
    },
    accountTypeButtonSelected: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    accountTypeButtonText: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    accountTypeButtonTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    // Checkbox Styles
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#dee2e6',
        borderRadius: 4,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    checkmark: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#2d4150',
    },
    // Button Styles
    addBankButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    addBankButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Bank Account Item Styles
    bankAccountItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    bankAccountInfo: {
        flex: 1,
    },
    bankName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 4,
    },
    bankAccountDetails: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 2,
        textTransform: 'capitalize',
    },
    bankAccountName: {
        fontSize: 12,
        color: '#6c757d',
    },
    defaultBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    defaultBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    // Payout Request Styles
    availableBalance: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    noBankAccountText: {
        fontSize: 14,
        color: '#dc3545',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 16,
    },
    bankSelectionContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    bankSelectionItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
        marginRight: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    bankSelectionItemSelected: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    bankSelectionName: {
        fontSize: 12,
        color: '#2d4150',
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    bankSelectionNameSelected: {
        color: '#fff',
    },
    bankSelectionDetails: {
        fontSize: 10,
        color: '#6c757d',
        textAlign: 'center',
    },
    bankSelectionDetailsSelected: {
        color: '#fff',
    },
    requestPayoutButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    requestPayoutButtonDisabled: {
        backgroundColor: '#dee2e6',
    },
    requestPayoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    payoutNote: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 16,
    },
    // Payout History Styles
    payoutHistoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    payoutHistoryLeft: {
        flex: 1,
    },
    payoutHistoryAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 4,
    },
    payoutHistoryDate: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 2,
    },
    payoutHistoryBank: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 2,
    },
    payoutHistoryEta: {
        fontSize: 11,
        color: '#007AFF',
        fontStyle: 'italic',
    },
    payoutHistoryStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 12,
    },
    payoutHistoryStatusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});

export default EarningModal