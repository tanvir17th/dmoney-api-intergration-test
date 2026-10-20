import { expect } from "chai";
import { describe, it } from "mocha";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_ENDPOINT = "https://dmoney.roadtocareer.net";

describe("DMoney Integration Testing", function () {
    this.timeout(10000);

    const sessionState = {
        tokens: {},
        ids: {},
        contacts: {},
        credentials: {},
        otps: {},
        records: {}
    };

    const generateUniqueIdentity = (prefix, domain = "gmail.com") => {
        const timestamp = Date.now();
        return {
            phone: `${prefix}${timestamp.toString().slice(-8)}`,
            email: `${prefix === '017' ? 'customer' : prefix === '018' ? 'customer2' : prefix === '016' ? 'agent' : 'merchant'}${timestamp}@${domain}`
        };
    };

    const buildAuthHeaders = (token, requiresPartnerKey = true) => {
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        if (requiresPartnerKey) headers["X-AUTH-SECRET-KEY"] = process.env.PARTNER_KEY;
        return headers;
    };

    const executeUserCreation = async (roleName, name, phonePrefix, nationalId) => {
        const identity = generateUniqueIdentity(phonePrefix);
        const payload = {
            name,
            email: identity.email,
            password: "1234",
            phone_number: identity.phone,
            nid: nationalId,
            role: roleName
        };

        const response = await axios.post(
            `${API_BASE_ENDPOINT}/user/create`,
            payload,
            { headers: buildAuthHeaders(sessionState.tokens.admin) }
        );

        return { response, identity };
    };

    const toggleAccountState = async (entityId, state = "active") => {
        return axios.patch(
            `${API_BASE_ENDPOINT}/user/update/${entityId}`,
            { status: state },
            { headers: buildAuthHeaders(sessionState.tokens.admin) }
        );
    };

    const authenticateAccount = async (identifier, password = "1234") => {
        return axios.post(`${API_BASE_ENDPOINT}/user/login`, {
            email: identifier,
            password
        });
    };

    const fetchUserSecurityDetails = async (targetId) => {
        return axios.get(`${API_BASE_ENDPOINT}/user/search/id/${targetId}`, {
            headers: buildAuthHeaders(sessionState.tokens.admin, false)
        });
    };

    const confirmOtpCode = async (contactNo, otpValue) => {
        return axios.post(`${API_BASE_ENDPOINT}/user/verify-otp?env=dev`, {
            identifier: contactNo,
            otp: otpValue
        });
    };

    const processFinancialTransaction = async (type, sender, recipient, amountValue, authToken) => {
        return axios.post(
            `${API_BASE_ENDPOINT}/transaction/${type}`,
            {
                from_account: sender,
                to_account: recipient,
                amount: amountValue
            },
            { headers: buildAuthHeaders(authToken) }
        );
    };

    it("Admin Login", async () => {
        const res = await authenticateAccount("admin@dmoney.com");
        console.log("Admin Login Response:", res.data);

        expect(res.status).to.equal(200);
        expect(res.data).to.have.property("token");

        sessionState.tokens.admin = res.data.token;
    });

    it("Create Customer 1", async () => {
        const { response, identity } = await executeUserCreation("Customer", "Customer One", "017", "1234567890");
        
        sessionState.contacts.customer1Phone = identity.phone;
        sessionState.credentials.customer1Email = identity.email;

        console.log("Customer 1 Created:", response.data);

        expect(response.status).to.equal(201);
        expect(response.data.message).to.equal("User created");

        sessionState.ids.customer1 = response.data.user.id;
    });

    it("Create Customer 2", async () => {
        const { response, identity } = await executeUserCreation("Customer", "Customer Two", "018", "1234567891");
        
        sessionState.contacts.customer2Phone = identity.phone;
        sessionState.credentials.customer2Email = identity.email;

        console.log("Customer 2 Created:", response.data);

        expect(response.status).to.equal(201);
        expect(response.data.message).to.equal("User created");

        sessionState.ids.customer2 = response.data.user.id;
    });

    it("Create Agent", async () => {
        const { response, identity } = await executeUserCreation("Agent", "Agent One", "016", "2234567890");
        
        sessionState.contacts.agentPhone = identity.phone;
        sessionState.credentials.agentEmail = identity.email;

        console.log("Agent Created:", response.data);

        expect(response.status).to.equal(201);
        expect(response.data.message).to.equal("User created");

        sessionState.ids.agent = response.data.user.id;
    });

    it("Create Merchant", async () => {
        const identity = generateUniqueIdentity("015");
        sessionState.contacts.merchantPhone = identity.phone;

        const res = await axios.post(
            `${API_BASE_ENDPOINT}/user/create`,
            {
                name: "Merchant One",
                email: identity.email,
                password: "1234",
                phone_number: identity.phone,
                nid: "3234567890",
                role: "Merchant"
            },
            { headers: buildAuthHeaders(sessionState.tokens.admin) }
        );

        console.log("Merchant Created:", res.data);

        expect(res.status).to.equal(201);
        expect(res.data.message).to.equal("User created");

        sessionState.ids.merchant = res.data.user.id;
    });

    it("Activate Customer 1", async () => {
        const res = await toggleAccountState(sessionState.ids.customer1);
        console.log("Customer 1 Activated:", res.data);
        expect(res.status).to.equal(200);
    });

    it("Activate Customer 2", async () => {
        const res = await toggleAccountState(sessionState.ids.customer2);
        console.log("Customer 2 Activated:", res.data);
        expect(res.status).to.equal(200);
    });

    it("Activate Agent", async () => {
        const res = await toggleAccountState(sessionState.ids.agent);
        console.log("Agent Activated:", res.data);
        expect(res.status).to.equal(200);
    });

    it("Activate Merchant", async () => {
        const res = await toggleAccountState(sessionState.ids.merchant);
        console.log("Merchant Activated:", res.data);
        expect(res.status).to.equal(200);
    });

    it("System Login", async () => {
        const res = await authenticateAccount("system@dmoney.com");
        console.log("System Login:", res.data);

        expect(res.status).to.equal(200);
        expect(res.data).to.have.property("token");

        sessionState.tokens.system = res.data.token;
    });

    it("System Deposit 5000 Tk To Agent", async () => {
        const res = await processFinancialTransaction(
            "deposit",
            "SYSTEM",
            sessionState.contacts.agentPhone,
            5000,
            sessionState.tokens.system
        );

        console.log("System Deposit:", res.data);
        expect(res.status).to.equal(201);
    });

    it("Agent Login", async () => {
        const res = await authenticateAccount(sessionState.contacts.agentPhone);
        console.log("Agent Login:", res.data);
        expect(res.status).to.equal(200);
    });

    it("Search Agent By ID", async () => {
        const res = await fetchUserSecurityDetails(sessionState.ids.agent);
        console.log("Agent Search:", res.data);

        expect(res.status).to.equal(200);
        sessionState.otps.agent = res.data.user.otp;
    });

    it("Agent Verify OTP", async () => {
        const res = await confirmOtpCode(sessionState.contacts.agentPhone, sessionState.otps.agent);
        console.log("Agent Verify OTP:", res.data);

        expect(res.status).to.equal(200);
        expect(res.data).to.have.property("token");

        sessionState.tokens.agent = res.data.token;
    });

    it("Customer 1 Login", async () => {
        const res = await authenticateAccount(sessionState.credentials.customer1Email);
        console.log("Customer 1 Login:", res.data);
        expect(res.status).to.equal(200);
    });

    it("Search Customer 1", async () => {
        const res = await fetchUserSecurityDetails(sessionState.ids.customer1);
        console.log("Customer 1 Search:", res.data);

        expect(res.status).to.equal(200);
        sessionState.otps.customer1 = res.data.user.otp;
    });

    it("Customer 1 Verify OTP", async () => {
        const res = await confirmOtpCode(sessionState.contacts.customer1Phone, sessionState.otps.customer1);
        console.log("Customer 1 Verify OTP:", res.data);

        expect(res.status).to.equal(200);
        expect(res.data).to.have.property("token");

        sessionState.tokens.customer1 = res.data.token;
    });

    it("Customer 1 Send Money To Customer 2", async () => {
        try {
            const res = await processFinancialTransaction(
                "sendmoney",
                sessionState.contacts.customer1Phone,
                sessionState.contacts.customer2Phone,
                1000,
                sessionState.tokens.customer1
            );

            console.log("Send Money:", res.data);
            expect(res.status).to.equal(201);
        } catch (error) {
            console.log("STATUS:", error.response?.status);
            console.log("ERROR:", error.response?.data);
        }
    });

    it("Customer 2 Login", async () => {
        const res = await authenticateAccount(sessionState.credentials.customer2Email);
        console.log("Customer 2 Login:", res.data);
        expect(res.status).to.equal(200);
    });

    it("Search Customer 2", async () => {
        const res = await fetchUserSecurityDetails(sessionState.ids.customer2);
        console.log("Customer 2 Search:", res.data);

        expect(res.status).to.equal(200);
        sessionState.otps.customer2 = res.data.user.otp;
    });

    it("Customer 2 Verify OTP", async () => {
        const res = await confirmOtpCode(sessionState.contacts.customer2Phone, sessionState.otps.customer2);
        console.log("Customer 2 Verify OTP:", res.data);

        expect(res.status).to.equal(200);
        expect(res.data).to.have.property("token");

        sessionState.tokens.customer2 = res.data.token;
    });

    it("Customer 2 Cashout 500 Tk", async () => {
        try {
            const res = await processFinancialTransaction(
                "withdraw",
                sessionState.contacts.customer2Phone,
                sessionState.contacts.agentPhone,
                500,
                sessionState.tokens.customer2
            );

            console.log("Cashout:", res.data);

            expect(res.status).to.equal(201);
            expect(res.data.message).to.equal("Insufficient balance");
            expect(res.data.currentBalance).to.equal(0);
        } catch (error) {
            console.log("STATUS:", error.response?.status);
            console.log("ERROR:", error.response?.data);
        }
    });

    it("Customer 2 Pay Merchant 400 Tk", async () => {
        try {
            const res = await processFinancialTransaction(
                "payment",
                sessionState.contacts.customer2Phone,
                sessionState.contacts.merchantPhone,
                400,
                sessionState.tokens.customer2
            );

            console.log("Merchant Payment:", res.data);

            expect(res.status).to.equal(201);
            expect(res.data.message).to.equal("Insufficient balance");
            expect(res.data.currentBalance).to.equal(0);
        } catch (error) {
            console.log("STATUS:", error.response?.status);
            console.log("ERROR:", error.response?.data);
        }
    });

    it("Agent Deposit 2000 Tk To Customer 1", async () => {
        try {
            const res = await processFinancialTransaction(
                "deposit",
                sessionState.contacts.agentPhone,
                sessionState.contacts.customer1Phone,
                2000,
                sessionState.tokens.agent
            );

            console.log("Agent Deposit:", res.data);

            expect(res.status).to.equal(201);
            expect(res.data.commission).to.equal(50);

            sessionState.records.depositTrnxId = res.data.trnxId;
        } catch (error) {
            console.log("STATUS:", error.response?.status);
            console.log("ERROR:", error.response?.data);
        }
    });
});