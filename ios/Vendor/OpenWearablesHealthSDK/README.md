# Vendored OpenWearablesHealthSDK

This directory contains the native Swift sources from
`rhiseai/open_wearables_ios_sdk` at the exact commit recorded in `REVISION`.
They are compiled into `OpenWearablesRNSDK`; consuming applications must not
declare a separate `OpenWearablesHealthSDK` pod.

When updating the native SDK, replace `Sources/OpenWearablesHealthSDK` and
`LICENSE` from the reviewed Rhise commit, update `REVISION`, then run the RN
build/lint checks and a clean CocoaPods iOS build before merging.
