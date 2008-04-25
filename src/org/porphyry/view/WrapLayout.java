/*
* Adapted from a source code by camickr on Sun Developer Networks forum
*/

package org.porphyry.view;

import java.awt.*;

import javax.swing.*;

public class WrapLayout extends FlowLayout {

	private Dimension preferredLayoutSize;

	public WrapLayout() {
		super(LEFT);
	}

	public WrapLayout(int align) {
		super(align);
	}

	public Dimension preferredLayoutSize(Container target) {
		return layoutSize(target, true);
	}

	public Dimension minimumLayoutSize(Container target) {
		return layoutSize(target, false);
	}

	private Dimension layoutSize(Container target, boolean preferred) {
		synchronized (target.getTreeLock()) {
		int targetWidth = target.getSize().width;
		if (targetWidth == 0) {
			targetWidth = Integer.MAX_VALUE;
		}
		int hgap = getHgap();
		int vgap = getVgap();
		Insets insets = target.getInsets();
		int maxWidth = 
			targetWidth - (insets.left + insets.right + hgap*2);
		Dimension dim = new Dimension(0, 0);
		int rowWidth = 0;
		int rowHeight = 0;
		for (Component m: target.getComponents()) {
			if (m.isVisible()) {
				Dimension d = preferred
					? m.getPreferredSize() 
					: m.getMinimumSize();
				if (rowWidth + d.width > maxWidth) {
					addRow(dim, rowWidth, rowHeight);
					rowWidth = 0;
					rowHeight = 0;
				}
				if (rowWidth > 0) {
					rowWidth += hgap;
				}
				rowWidth += d.width;
				rowHeight = Math.max(rowHeight, d.height);
			}
		}
		addRow(dim, rowWidth, rowHeight);
		dim.width += insets.left + insets.right + hgap * 2;
		dim.height += insets.top + insets.bottom + vgap * 2;
		return dim;
	}
	}

	private void addRow(Dimension dim, int rowWidth, int rowHeight) {
		dim.width = Math.max(dim.width, rowWidth);
		if (dim.height > 0) {
			dim.height += getVgap();
		}
		dim.height += rowHeight;
	}

	public void layoutContainer(final Container target) {
		Dimension size = preferredLayoutSize(target);
		if (size.equals(preferredLayoutSize)) {
			super.layoutContainer(target);
		} else {
			preferredLayoutSize = size;
			target.invalidate();
			Container top = target;
			while (top.getParent() != null) {
				top = top.getParent();
			}
			top.validate();
		}
	}
}
