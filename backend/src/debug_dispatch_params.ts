
import { PrismaClient, EmergencyRequestStatus, Priority, RequestSource } from '@prisma/client'
const prisma = new PrismaClient()

async function test() {
  try {
    const data = {
        trackingCode: "TEST-01",
        priority: Priority.HIGH,
        requestSource: RequestSource.PHONE_CALL,
        pickupLocation: "vbvc",
        destination: "fgnbcv",
        callerName: "fgd",
        callerPhone: "6545",
        symptoms: "hgfh",
        pickupLandmark: "bcvnbcv",
        destinationLandmark: "vbvcb",
        patientCondition: "gfgf",
        notes: "hghgf",
        manualDispatchNotes: "gbdfg",
        status: EmergencyRequestStatus.PENDING
    }

    console.log("Starting test dispatch...")
    const res = await prisma.emergencyRequest.create({
      data: {
        ...data,
        patient: { connect: { id: "cmndgh5yt000fvwxzr4pslo3l" } }, // Used real ID Majid Ali (PAT-0001)
      }
    })
    console.log("Success:", JSON.stringify(res, null, 2))
  } catch (e) {
    console.error("FAILED TEST:", e)
  } finally {
    await prisma.$disconnect()
  }
}
test()
