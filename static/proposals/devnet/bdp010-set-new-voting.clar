;; Title: BDP000 transformer-1
;; Author: Mike Cohen
;; Synopsis:
;; Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens.
;; Description:
;; Bootstraps bigmarket-dao for stacks ecosystem voting. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens.

(impl-trait .proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		;; Enable genesis extensions.
		(try! (contract-call? .bigmarket-dao set-extensions
			(list
				{extension: .bme001-0-proposal-voting, enabled: false}
				{extension: .bme001-0-proposal-voting, enabled: true}
			)
		))
		(print "BigMarket DAO has been reconfigured.")
		(ok true)
	)
)
