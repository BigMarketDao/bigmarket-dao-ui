;; Title: BDP000 transformer-1
;; Author: Mike Cohen
;; Synopsis:
;; Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens.
;; Description:
;; Bootstraps bitcoin-dao for stacks ecosystem voting. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens.

(impl-trait .proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		;; Enable genesis extensions.
		(try! (contract-call? .bitcoin-dao set-extensions
			(list
				{extension: .bde001-proposal-voting, enabled: false}
				{extension: .bde001-proposal-voting-full-balance, enabled: true}
			)
		))
		(print "Bitcoin DAO has been reconfigured.")
		(ok true)
	)
)
