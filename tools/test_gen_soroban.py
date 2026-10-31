import unittest

from gen_soroban import render_diagram


class RenderDiagramTests(unittest.TestCase):
    def test_builds_stable_svg_for_a_number(self):
        spec = {"rods": 3, "value": 204, "highlight": [1], "label": "Two hundred four"}
        first = render_diagram(spec)
        self.assertEqual(first, render_diagram(spec))
        self.assertIn("Two hundred four", first)
        self.assertIn("number 204", first)
        self.assertEqual(first.count("<line"), 4)

    def test_rejects_number_that_does_not_fit(self):
        with self.assertRaises(ValueError):
            render_diagram({"rods": 2, "value": 100})


if __name__ == "__main__":
    unittest.main()